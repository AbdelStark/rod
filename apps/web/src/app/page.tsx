"use client";

import { useState } from "react";
import Header from "./components/header";
import Balance from "./components/balance";
import Actions from "./components/actions";
import QuickSend from "./components/quick-send";
import TransactionHistory from "./components/transaction-history";

interface Transaction {
  id: number;
  amount: number;
  date: Date;
}

interface Contact {
  handle: string;
  avatarUrl: string;
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

  const handleNotificationClick = () => {
    console.log("Notification button clicked");
    // Implement notification functionality here
  };

  const handleSettingsClick = () => {
    console.log("Settings button clicked");
    // Implement settings page navigation here
  };

  const handleSearchClick = () => {
    console.log("Search button clicked");
    // Implement search functionality here
  };

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen">
      <Header
        avatarUrl="/avatar/goku.jpeg"
        onNotificationClick={handleNotificationClick}
        onSearchClick={handleSearchClick}
        onSettingsClick={handleSettingsClick}
        userHandle="@goku"
        userHandle="@goku"
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
