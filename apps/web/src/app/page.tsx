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
import Settings from "./components/settings";

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
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [connect, setConnect] = useState<Connect | null>(null);

  useEffect(() => {
    initializeNostrConnect();
  }, []);

  async function initializeNostrConnect() {
    try {
      const { secretKey, publicKey } =
        await NostrKeyManager.getOrCreateKeyPair();
      console.log("Nostr keypair ready:", { publicKey });

      const newConnect = new Connect({
        secretKey,
        relay: "wss://nostr.vulpem.com",
      });
      newConnect.events.on("connect", (walletPubkey: string) => {
        console.log("Connected with wallet:", walletPubkey);
      });
      await newConnect.init();

      setConnect(newConnect);
    } catch (error) {
      console.error("Error initializing Nostr keypair:", error);
    }
  }

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
