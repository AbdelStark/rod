"use client";

import { useState } from "react";
import Header from "./components/header";
import Balance from "./components/balance";
import Actions from "./components/actions";
import TransactionHistory from "./components/transaction-history";

interface Transaction {
  id: number;
  amount: number;
  date: Date;
}

export default function Home() {
  const [balance, setBalance] = useState<number>(10860);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, amount: -100, date: new Date(Date.now() - 120000) },
    { id: 2, amount: 100, date: new Date(Date.now() - 180000) },
    { id: 3, amount: 100, date: new Date(Date.now() - 240000) },
    { id: 4, amount: -55, date: new Date(Date.now() - 172800000) },
    // Add more transactions here to test pagination
  ]);

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

  const handleNotificationClick = () => {
    console.log("Notification button clicked");
    // Implement notification functionality here
  };

  const handleSettingsClick = () => {
    console.log("Settings button clicked");
    // Implement settings page navigation here
  };

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen">
      <Header
        avatarUrl="/avatar.jpeg"
        onNotificationClick={handleNotificationClick}
        onSettingsClick={handleSettingsClick}
        userHandle="@goku"
      />
      <Balance balance={balance} />
      <Actions
        onGift={handleGift}
        onReceive={handleReceive}
        onScan={handleScan}
        onSend={handleSend}
      />
      <TransactionHistory transactions={transactions} />
    </div>
  );
}
