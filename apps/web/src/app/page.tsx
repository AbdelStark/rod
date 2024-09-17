"use client";

import { useEffect, useState } from "react";
import Header from "./components/header";
import Balance from "./components/balance";
import Actions from "./components/actions";
import QuickSend from "./components/quick-send";
import TransactionHistory from "./components/transaction-history";
import NotificationModal from "./components/notification-modal";
import SearchModal from "./components/search-modal";
import TransactionModal from "./components/transaction-modal";
import ReceiveModal from "./components/receive-modal";
import { KEYS_STORAGE } from "./constants";
import { generateNewMnemonic } from "@cashu/cashu-ts";
import { useCashuStore } from "../store";

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
  const [balance, setBalance] = useState<number>(10860);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      amount: -100,
      date: new Date(Date.now() - 120000),
      description: "Coffee",
      status: "completed",
      recipient: "@starbucks",
      fee: 0,
    },
    {
      id: 2,
      amount: 100,
      date: new Date(Date.now() - 180000),
      description: "Refund",
      status: "completed",
      sender: "@amazon",
      fee: 0,
    },
    {
      id: 3,
      amount: 100,
      date: new Date(Date.now() - 240000),
      description: "Gift from @vegeta",
      status: "completed",
      sender: "@vegeta",
      fee: 0,
    },
    {
      id: 4,
      amount: -55,
      date: new Date(Date.now() - 172800000),
      description: "Movie tickets",
      status: "completed",
      recipient: "@cineplex",
      fee: 0,
    },
    {
      id: 5,
      amount: 42,
      date: new Date(Date.now() - 1814400000),
      description: "Cashback",
      status: "completed",
      sender: "@creditcard",
      fee: 0,
    },
    {
      id: 6,
      amount: -23,
      date: new Date(Date.now() - 1814600000),
      description: "Snacks",
      status: "completed",
      recipient: "@7eleven",
      fee: 0,
    },
  ]);

  const {mnemonic, setMnemonic} = useCashuStore()
  useEffect(() => {
    const checkMnemonic = () => {
      if(typeof window == "undefined") return;


      const mnemonic = window.localStorage.getItem(KEYS_STORAGE.MNEMONIC.toString())
      console.log("mnemonic",mnemonic)

      if(!mnemonic) {

        const nMnemonic = generateNewMnemonic()
        /** Encrypt mnemonic with a password? */
        window.localStorage.setItem(KEYS_STORAGE.MNEMONIC.toString(), nMnemonic)
        setMnemonic(nMnemonic)
      }
    }
    checkMnemonic()
  },[mnemonic, window])
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

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseTransactionModal = () => {
    setSelectedTransaction(null);
  };

  const handleTransaction = (amount: number) => {
    setBalance((prevBalance) => prevBalance + amount);
    setTransactions((prevTransactions) => [
      {
        id: prevTransactions.length + 1,
        amount,
        date: new Date(),
        description: amount > 0 ? "Received" : "Sent",
        status: "completed",
      },
      ...prevTransactions,
    ]);
  };

  const handleSend = () => {
    handleTransaction(-100);
  };
  const handleReceive = () => {
    handleTransaction(100);
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
    console.log("Settings button clicked");
    // Implement settings page navigation here
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
        notifications={notifications}
        onClose={() => {
          setIsReceiveModalOpen(false);
        }}
        onGenerateInvoice={handleMarkNotificationsAsRead}
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
      <TransactionHistory
        onTransactionClick={handleTransactionClick}
        transactions={transactions}
      />
      {selectedTransaction ? (
        <TransactionModal
          onClose={handleCloseTransactionModal}
          transaction={selectedTransaction}
        />
      ) : null}{" "}
    </div>
  );
}
