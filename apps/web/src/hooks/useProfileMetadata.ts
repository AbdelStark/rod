import { Proof } from "@cashu/cashu-ts"
import { getProofs } from "../utils/storage/cashu"
import { useCashu } from "./useCashu"
import { useNostrContext } from "../app/context"
import { nip19 } from "nostr-tools"
import NDK, { NDKEvent, NDKKind, NDKUserProfile } from "@nostr-dev-kit/ndk"
import { useState } from "react"

export const useProfileMetadata = () => {
    const { ndk } = useNostrContext()
    const [profileEvent, setProfileEvent] = useState<NDKEvent | undefined>()
    const [profileToAdd, setProfileToAdd] = useState<NDKUserProfile | undefined>()

    const handleCheckNostr = async (nostrAddress?: string) => {
        console.log("handleCheckNostr", nostrAddress)

        if (!nostrAddress) return;
        console.log("nostrAddress", nostrAddress)


        if (nostrAddress?.includes("npub") || nostrAddress?.includes("nprofile")) {


            const addressPub = await nip19.decode(nostrAddress)
            console.log("addressPub data", addressPub?.data)

            const dataStr = JSON.stringify(addressPub?.data)

            const data: {
                pubkey?: string,
                relays?: string[],
            } = JSON.parse(dataStr)

            if (typeof data?.pubkey === "string" && typeof data?.relays !== "undefined") {
                console.log("pubkey", data?.pubkey)
                console.log("relays", data?.relays)

                const newNdk = new NDK({
                    explicitRelayUrls: data.relays,
                });

                await newNdk.connect()


                const profile = await newNdk.fetchEvent({
                    kinds: [NDKKind.Metadata],
                    authors: [data.pubkey]
                })
                console.log("profile", profile)
                if (profile) {
                    setProfileEvent(profile)
                    const user = newNdk.getUser({ pubkey: profile?.pubkey });
                    const profileUser = await user.fetchProfile();
                    if (profileUser) {
                        setProfileToAdd(profileUser)
                    }

                    return {
                        user: profileUser,
                        event: profile,

                    }
                }
            }

        } else {
            const profile = await ndk.fetchEvent({
                kinds: [NDKKind.Metadata],
                authors: [nostrAddress]

            })
            console.log("profile", profile)
            if (profile) {
                setProfileEvent(profile)
                const user = ndk.getUser({ pubkey: profile?.pubkey });
                const profileUser = await user.fetchProfile();
                if (profileUser) {
                    setProfileToAdd(profileUser)
                }
                return {
                    user: profileUser,
                    event: profile,
                }
            }
        }

    }

    return {
        handleCheckNostr,
        eventProfile:profileEvent,
        user:profileToAdd
    }

}