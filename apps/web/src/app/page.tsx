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
import ManageContactModal from "./components/modal-manage-contacts";
import { Transaction, Contact, Notification } from "../types";
import { getContacts } from "../utils/storage/nostr";
import MintManagement from "./components/mint-management";
import { ProofInvoice } from "../types/wallet";
import { useCashuBalance } from "../hooks/useCashuBalance";


export default function Home() {
  const router = useRouter()

  const { wallet, mint, getKeySets, getKeys, mintUrl } = useCashu()
  const { addToast } = useToast()
  const { setMnemonic, setContacts: setContactsStore, activeBalance } = useCashuStore()
  const { getProofsWalletAndBalance, balance, setBalance, balanceMemo, } = useCashuBalance()

  const { setAuth } = useAuth()
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isManageContactsModalOpen, setIsManageContactsModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isFirstLoadDone, setIsFirstLoadDone] = useState(false);

  const [contacts, setContacts] = useState<Contact[]>(
    [
      // { nip05: "@gohan", image: "/avatar/gohan.jpg",
      //   displayName:"gohan",
      //  },
      // { nip05: "@vegeta", image: "/avatar/vegeta.jpeg",
      //   displayName:"vegeta",

      //  },
      // { nip05: "@frieza", image: "/avatar/frieza.png",
      //   displayName:"frieza"
      //  },
      // { nip05: "@piccolo", image: "/avatar/piccolo.jpg" },
      // { nip05: "@cell", image: "/avatar/cell.jpg" },
    ]
  )


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


  const getContactsLocal = () => {
    if (isFirstLoadDone) return;
    const contactLocalStr = getContacts()
    if (contactLocalStr) {
      let contactsLocal: Contact[] = JSON.parse(contactLocalStr)

      const contactsSet = new Set([...contactsLocal])
      setContacts(Array.from(contactsSet))
      setContactsStore(Array.from(contactsSet))
    }



  }
  const checkWalletSetup = async () => {

    const isWalletSetup = await NostrKeyManager.getIsWalletSetup()

    if (isConnected) return;

    if (isWalletSetup && isWalletSetup == "true") {
      const result = await NostrKeyManager.getDecryptedPrivateKey()
      if (!result) {
        addToast({ title: "Authentification issue.", type: TypeToast.warning })

        // return router.push("/onboarding")

      } else {
        const { secretKey, mnemonic, publicKey } = result
        setAuth(publicKey, secretKey,)
        setMnemonic(mnemonic)
        // addToast({ title: "GM! Connected successfully", type: TypeToast.success })
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
  useEffect(() => {
    getContactsLocal()
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

      <ManageContactModal
        contacts={contacts}
        isOpen={isManageContactsModalOpen}
        onClose={() => {
          setIsManageContactsModalOpen(false);
        }}
      />
      <Balance
        // balance={balance} 
        // balance={balanceMemo}
        balance={activeBalance}

      />
      <Actions
        onGift={handleGift}
        onReceive={handleReceive}
        onScan={handleScan}
        onSend={handleSend}
      />
      <QuickSend contacts={contacts} onSend={handleQuickSend}
        onOpen={() => {
          setIsManageContactsModalOpen(true)
        }}
      />

      <TabGroup>

        <TabList className={"flex gap-5"}>
          <Tab
            className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
          >Invoices</Tab>
          <Tab
            className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"

          >Transactions</Tab>
          <Tab
            className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
          >Mint</Tab>
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
          <TabPanel>
            <MintManagement
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
