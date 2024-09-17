"use client";

import { useState } from "react";
import Header from "./components/header";
import Balance from "./components/balance";
import Actions from "./components/actions";
import QuickSend from "./components/quick-send";
import TransactionHistory from "./components/transaction-history";
import NotificationModal from "./components/notification-modal";
import SearchModal from "./components/search-modal";

interface Transaction {
  id: number;
  amount: number;
  date: Date;
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
    { id: 1, amount: -100, date: new Date(Date.now() - 120000) },
    { id: 2, amount: 100, date: new Date(Date.now() - 180000) },
    { id: 3, amount: 100, date: new Date(Date.now() - 240000) },
    { id: 4, amount: -55, date: new Date(Date.now() - 172800000) },
    { id: 5, amount: 42, date: new Date(Date.now() - 1814400000) },
    { id: 6, amount: -23, date: new Date(Date.now() - 1814600000) },
  ]);

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

  const handleTransaction = (amount: number) => {
    setBalance((prevBalance) => prevBalance + amount);
    setTransactions((prevTransactions) => [
      {
        id: prevTransactions.length + 1,
        amount,
        date: new Date(),
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
      <TransactionHistory transactions={transactions} />
    </div>
  );
}
