"use client";

import { useState, useEffect } from "react";
import { Connect } from "@nostr-connect/connect";
import { NostrKeyManager } from "../../utils/nostr-key-manager";
import Header from "../components/header";
import Balance from "../components/balance";
import Actions from "../components/actions";
import QuickSend from "../components/quick-send";
import TransactionHistory from "../components/transaction-history";
import NotificationModal from "../components/notification-modal";
import SearchModal from "../components/search-modal";
import TransactionModal from "../components/transaction-modal";
import ReceiveModal from "../components/receive-modal";
import { KEYS_STORAGE } from "../constants";
import { useAuth, useCashuStore } from "../../store";
import Settings from "../components/settings";
import { useCashu } from "../../hooks/useCashu";
import { MINTS_URLS } from "../../utils/relay";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import InvoicesHistory from "../components/invoices-history";
import SendModal from "../components/send-modal";
import NwcMint from "../components/nwc-mint";
import { useRouter } from "next/navigation";

interface Transaction {
  id: number;
  amount: number;
  date: Date;
  description: string;
  status: "completed" | "pending" | "failed";
  recipient?: string;
  sender?: string;
  fee?: number;
}
interface Contact {
  handle: string;
  avatarUrl: string;
}

interface Notification {
  id: number;
  message: string;
  date: Date;
  read: boolean;
}

export default function NWCWallet() {
  const router = useRouter()

  const { mnemonic, setMnemonic } = useCashuStore()
  const { publicKey, setPublicKey, setAuth } = useAuth()
  const { connectCashMint, connectCashWallet } = useCashu()
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [connect, setConnect] = useState<Connect | null>(null);

  // useEffect(() => {
  //   initializeNostrConnect();
  // }, []);
  async function initializeNostrConnect() {
    try {

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

      <p>Create your ecash wallet</p>
      <p>You can use passkeys to secure to private key and seed.</p>
      <button
        className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"

        // onClick={() => initializeNostrConnect}
        onClick={initializeNostrConnect}
      >Login with passkeys</button>
    </div>
  );
}
