"use client";

import { useState } from "react";
import { Connect } from "@nostr-connect/connect";
import { NostrKeyManager } from "../../utils/nostr-key-manager";
import { useAuth, useCashuStore } from "../../store";
import { useCashu } from "../../hooks/useCashu";
import { MINTS_URLS } from "../../utils/relay";
import { useRouter } from "next/navigation";


export default function NWCWallet() {
  const router = useRouter()

  const {  setMnemonic } = useCashuStore()
  const { setAuth } = useAuth()
  const { connectCashMint, connectCashWallet } = useCashu()

  const [, setConnect] = useState<Connect | null>(null);
  async function initializeNostrConnect() {
    try {

      const isWalletSetup = await NostrKeyManager.getIsWalletSetup()
      console.log("isWalletSetup", isWalletSetup)

      if (isWalletSetup && isWalletSetup == "true") {
        return router.push("/onboarding")
      }

      const { secretKey, publicKey, mnemonic } =
        await NostrKeyManager.getOrCreateKeyPair();
      console.log("Nostr keypair ready:", { publicKey });
      setAuth(publicKey, secretKey,)
      setMnemonic(mnemonic)

      const newConnect = new Connect({
        secretKey,
        relay: "wss://nostr.vulpem.com",
      });
      newConnect.events.on("connect", (walletPubkey: string) => {
        console.log("Connected with wallet:", walletPubkey);
      });
      await newConnect.init();

      const { mint, keys } = await connectCashMint(MINTS_URLS.MINIBITS)
      console.log("cashuMint", mint)
      const wallet = await connectCashWallet(mint, keys[0])
      console.log("wallet", wallet)

      setConnect(newConnect);

      router.push("/")
    } catch (error) {
      console.error("Error initializing Nostr keypair:", error);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen">

      <p>Create your ecash wallet and Nostr account</p>

      <p>You can use passkeys to secure to private key and seed.</p>

      <button
        className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
        onClick={initializeNostrConnect}
      >Login with passkeys</button>
    </div>
  );
}
