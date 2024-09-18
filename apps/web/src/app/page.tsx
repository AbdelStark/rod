"use client";

import { useState, useEffect } from "react";
import { Connect } from "@nostr-connect/connect";
import { NostrKeyManager } from "../utils/nostr-key-manager";
import Header from "./components/header";
import Balance from "./components/balance";
import Actions from "./components/actions";
import QuickSend from "./components/quick-send";
import TransactionHistory from "./components/transaction-history";
import NotificationModal from "./components/notification-modal";
import SearchModal from "./components/search-modal";
import TransactionModal from "./components/transaction-modal";
import ReceiveModal from "./components/receive-modal";
import { useAuth, useCashuStore } from "../store";
import Settings from "./components/settings";
import { useCashu } from "../hooks/useCashu";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import InvoicesHistory from "./components/invoices-history";
import { useRouter } from "next/navigation";
import { TypeToast, useToast } from "../hooks/useToast";
import { Proof } from "@cashu/cashu-ts";
import { addProofsSpent, getProofs } from "../utils/storage/cashu";
import SendModal from "./components/send-modal";

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

export default function Home() {
  // const [balance, setBalance] = useState<number>(10860);
  const [balance, setBalance] = useState<number>(0);
  const router = useRouter()

  const { setMnemonic } = useCashuStore()
  const { setAuth } = useAuth()
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const contacts: Contact[] = [
    { handle: "@gohan", avatarUrl: "/avatar/gohan.jpg" },
    { handle: "@vegeta", avatarUrl: "/avatar/vegeta.jpeg" },
    { handle: "@frieza", avatarUrl: "/avatar/frieza.png" },
    { handle: "@piccolo", avatarUrl: "/avatar/piccolo.jpg" },
    { handle: "@cell", avatarUrl: "/avatar/cell.jpg" },
  ];

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "You received 100 sats from @vegeta",
      date: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: 2,
      message: "Your transaction of 55 sats to @gohan is completed",
      date: new Date(Date.now() - 7200000),
      read: false,
    },
    {
      id: 3,
      message: "Welcome to Rod wallet application!",
      date: new Date(Date.now() - 86400000),
      read: true,
    },
  ]);

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const { wallet } = useCashu()
  const { addToast } = useToast()

  const getProofsWalletAndBalance = async () => {
    const proofsLocal = getProofs()
    if (proofsLocal) {
      /** TODO clean proofs */
      let proofs: Proof[] = JSON.parse(proofsLocal)
      const proofsSpent = await wallet?.checkProofsSpent(proofs)
      // console.log("proofsSpent", proofsSpent)
      proofs = proofs?.filter((p) => {
        if (!proofsSpent?.includes(p)) {
          return p;
        }
      })

      if (proofsSpent) {
        await addProofsSpent(proofsSpent)
      }
      const totalAmount = proofs.reduce((s, t) => (s += t.amount), 0);
      console.log("totalAmount", totalAmount)
      setBalance(totalAmount)

    }
  }
  const checkWalletSetup = async () => {

    const isWalletSetup = await NostrKeyManager.getIsWalletSetup()

    if (isConnected) return;

    if (isWalletSetup && isWalletSetup == "true") {
      const result = await NostrKeyManager.getDecryptedPrivateKey()
      if (!result) {

      } else {
        const { secretKey, mnemonic, publicKey } = result
        setAuth(publicKey, secretKey,)
        setMnemonic(mnemonic)
        addToast({ title: "GM! Connected successfully", type: TypeToast.success })
        setIsConnected(true)
        await getProofsWalletAndBalance()
      }

    } else if (!isWalletSetup) {
      return router.push("/onboarding")
    }
  }
  useEffect(() => {
    checkWalletSetup()
  }, [isConnected]);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseTransactionModal = () => {
    setSelectedTransaction(null);
  };

  const handleSend = () => {
    setIsSendModalOpen(true);
  };

  const handleReceive = () => {
    setIsReceiveModalOpen(true);
  };
  const handleScan = () => {
    console.log("Scanning QR code");
  };
  const handleGift = () => {
    console.log("Gift functionality");
  };

  const handleQuickSend = (handle: string) => {
    console.log(`Quick send to ${handle}`);
    // Implement quick send functionality here
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleSearchClick = () => {
    console.log("Search button clicked");
    setIsSearchModalOpen(true);
  };

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
  };

  const handleMarkNotificationsAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen">
      <Header
        avatarUrl="/avatar/goku.jpeg"
        onNotificationClick={handleNotificationClick}
        onSearchClick={handleSearchClick}
        onSettingsClick={handleSettingsClick}
        unreadNotificationsCount={unreadNotificationsCount}
        userHandle="@goku"
      />
      <NotificationModal
        isOpen={isNotificationModalOpen}
        notifications={notifications}
        onClose={() => {
          setIsNotificationModalOpen(false);
        }}
        onMarkAsRead={handleMarkNotificationsAsRead}
      />

      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={() => {
          setIsReceiveModalOpen(false);
        }}
      />
      <SendModal
        isOpen={isSendModalOpen}
        onClose={() => {
          setIsSendModalOpen(false);
        }}
      />
      <SearchModal
        contacts={contacts}
        isOpen={isSearchModalOpen}
        onClose={() => {
          setIsSearchModalOpen(false);
        }}
      />
      <Balance balance={balance} />
      <Actions
        onGift={handleGift}
        onReceive={handleReceive}
        onScan={handleScan}
        onSend={handleSend}
      />
      <QuickSend contacts={contacts} onSend={handleQuickSend} />

      <TabGroup>

        <TabList className={"flex gap-5"}>
          <Tab
            className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
          >Invoices</Tab>
          <Tab
            className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"

          >Transactions</Tab>
        </TabList>
        <TabPanels>

          <TabPanel>
            <InvoicesHistory
              onTransactionClick={handleTransactionClick}
            // transactions={transactions}
            />
          </TabPanel>
          <TabPanel>
            <TransactionHistory
              onTransactionClick={handleTransactionClick}
            // transactions={transactions}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>

      {selectedTransaction ? (
        <TransactionModal
          onClose={handleCloseTransactionModal}
          transaction={selectedTransaction}
        />
      ) : null}{" "}
      {isSettingsOpen ? (
        <Settings
          isOpen={isSettingsOpen}
          onClose={() => {
            setIsSettingsOpen(false);
          }}
        />
      ) : null}

    </div>
  );
}
