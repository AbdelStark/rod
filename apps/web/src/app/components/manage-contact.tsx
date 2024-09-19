import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { getTransactions } from "../../utils/storage/cashu";
import { ICashuInvoice } from "../../types/wallet";
import { MintQuoteState } from "@cashu/cashu-ts";
import { Contact } from "../../types";
import { getContacts } from "../../utils/storage/nostr";
import { useNostrContext } from "../context";
import NDK, { NDKEvent, NDKKind, NDKUserProfile } from "@nostr-dev-kit/ndk";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import { nip19 } from "nostr-tools";
import { TypeToast, useToast } from "../../hooks/useToast";

interface ManageContactsProps {
  contactsProps?: Contact[];
  onDeleteContact?: (contact: Contact) => void;
  onAddContact?: (contact: Contact) => void;
}

const TRANSACTIONS_PER_PAGE = 5;

const ManageContacts: React.FC<ManageContactsProps> = ({
  contactsProps
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { ndk } = useNostrContext()
  const [_, setAnimate] = useState(false);
  const [contacts, setContacts] = useState<Contact[] | undefined>(contactsProps)
  const [nostrAddress, setNostrAddress] = useState<string | undefined>()
  const [npubAddress, setNpubAddress] = useState<string | undefined>()
  const [nip05, setNip05] = useState<string | undefined>()
  const [lud16, setLud16] = useState<string | undefined>()
  const [profileEvent, setProfileEvent] = useState<NDKEvent | undefined>()
  const [profileToAdd, setProfileToAdd] = useState<NDKUserProfile | undefined>()

  const { addToast } = useToast()
  const totalContact = useMemo(() => {

    return contacts?.length ?? 10
  }, [contacts])


  const totalPages = Math.ceil(totalContact / TRANSACTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const visibleContacts = contacts?.reverse().slice(
    // const visibleContacts = txInvoices?.reverse().slice(
    startIndex,
    startIndex + TRANSACTIONS_PER_PAGE,
  );
  console.log("visibleContacts", visibleContacts)
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [currentPage]);



  const handleCheckNostr = async () => {
    console.log("handleCheckNostr", nostrAddress)

    if (!nostrAddress) return;
    console.log("nostrAddress", nostrAddress)


    if (nostrAddress?.includes("npub") || nostrAddress?.includes("nprofile")) {


      const addressPub = await nip19.decode(nostrAddress)
      console.log("addressPub", addressPub)
      console.log("addressPub data", addressPub?.data)

      const dataStr = JSON.stringify(addressPub?.data)
      console.log("dataStr", dataStr)

      const data: {
        pubkey?: string,
        relays?: string[],
      } = JSON.parse(dataStr)
      console.log("data", data)


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
      }
    }

  }

  const handleAddNostrAddressContact = async () => {

    if (!nostrAddress) return;
    console.log("nostrAddress", nostrAddress)


    if (nostrAddress?.includes("npub") || nostrAddress?.includes("nprofile")) {


      const addressPub = await nip19.decode(nostrAddress)
      console.log("addressPub", addressPub)
      console.log("addressPub data", addressPub?.data)

      const dataStr = JSON.stringify(addressPub?.data)
      console.log("dataStr", dataStr)

      const data: {
        pubkey?: string,
        relays?: string[],
      } = JSON.parse(dataStr)
      console.log("data", data)


      if (typeof data?.pubkey === "string" && typeof data?.relays !== "undefined") {
        console.log("pubkey", data?.pubkey)
        console.log("relays", data?.relays)

        const newNdk = new NDK({
          explicitRelayUrls: data.relays,
        });


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
      }
    }

  }
  useEffect(() => {
    const handleGetInvoices = async () => {
      const invoicesLocal = await getContacts()

      if (invoicesLocal) {
        const invoices: Contact[] = JSON.parse(invoicesLocal)
        // const invoicesPaid = invoices.filter((i) => i?.state === MintQuoteState?.ISSUED || i?.state === MintQuoteState.PAID)
        setContacts(invoices)

      }

      const profiles = await ndk.fetchEvents({
        kinds: [NDKKind.Metadata],

      })
      console.log("profiles", profiles)
    }
    handleGetInvoices()
  }, [])

  const handleChangeNostrAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNostrAddress(value);

  };

  const handleRemoveContact = () => {
    addToast({
      title: "Remove coming soon", type: TypeToast.success
    })
  }

  return (
    <div
      // className="overflow-y overflow-scroll"
    >
      <h3 className="section-title mb-4 ">All contacts</h3>
      <TabGroup>

        <TabList
          className={"flex gap-5"}>
          <Tab
            className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
          >
            All contacts
          </Tab>
          <Tab
            className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
          >Add new contact</Tab>
        </TabList>
        <TabPanels>

          <TabPanel>
            <div className="card">
              {visibleContacts && visibleContacts?.length > 0 && visibleContacts?.map((c) => (
                <div
                  // className="transaction-item px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                  key={c?.handle}
                  onClick={() => {
                    // onTransactionClick(tx);
                  }}
                >




                  <div className="justify-between items-center mt-1">
                    <div>

                      {c?.avatarUrl &&
                        <Image
                          alt={`Avatar of ${c?.avatarUrl}`}
                          height={30}
                          src={c?.avatarUrl}
                          width={30}
                        // width={70}
                        />
                      }
                    </div>
                    <p className="text-sm text-text-secondary">
                      {c?.handle}
                      {/* {formatDate(new Date(tx?.date ?? new Date()))} */}
                    </p>
                  </div>

                  <div>
                    <button onClick={handleRemoveContact}>Remove</button>
                  </div>



                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <button
                  className="pagination-button"
                  disabled={currentPage === 1}
                  onClick={goToPreviousPage}
                >
                  <ChevronLeftIcon className="w-5 h-5 text-text-secondary" />
                </button>
                <span className="pagination-text">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="pagination-button"
                  disabled={currentPage === totalPages}
                  onClick={goToNextPage}
                >
                  <ChevronRightIcon className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
            )}
          </TabPanel>

          <TabPanel>
            <div>

              <div>Add a contact with Nostr address</div>

              <input
                className="bg-black text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                onChange={handleChangeNostrAddress}
                type="text"
                value={nostrAddress}
              >
              </input>

              <div>

                {profileEvent &&

                  <div>

                  </div>
                }

                {profileToAdd &&
                  <>

                    {/* {profileToAdd?.image &&
                      <Image
                        alt={`Avatar of ${profileToAdd.handle}`}
                        height={64}
                        src={profileToAdd?.image}
                        width={64}
                      />
                    } */}
                    <div
                      className="flex justify-between items-center mt-1">
                    </div>

                    <div>
                      <p className="text-sm text-text-secondary">
                        NIP05:  {profileToAdd?.nip05}
                      </p>
                      <div >
                        <p className="text-sm text-text-secondary">
                          Lightning address:  {profileToAdd?.lud16}
                        </p>
                      </div>
                      <p className="text-sm text-text-secondary">
                        Name:  {profileToAdd?.displayName}
                      </p>
                      <p className="text-sm text-text-secondary">
                        About:  {profileToAdd?.about}
                      </p>
                      <p className="text-sm text-text-secondary">
                        Bio:  {profileToAdd?.bio}
                      </p>
                      <p className="text-sm text-text-secondary">
                        Name:  {profileToAdd?.name}
                      </p>
                    </div>
                  </>

                }
              </div>
              <button
                className="mt-6 w-full bg-accent text-white rounded-lg py-2 hover:bg-opacity-90 transition-colors duration-150"

                onClick={handleCheckNostr}
              >

                Check address

              </button>


              <button
                className="mt-6 w-full bg-accent text-white rounded-lg py-2 hover:bg-opacity-90 transition-colors duration-150"

                onClick={ handleAddNostrAddressContact}
              >

                Add contact

              </button>


            </div>
          </TabPanel>

        </TabPanels>



      </TabGroup>



    </div >
  );
};

export default ManageContacts;
