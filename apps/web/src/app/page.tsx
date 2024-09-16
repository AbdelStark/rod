"use client";

import { useState } from "react";
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
    { id: 1, amount: -100, date: new Date(Date.now() - 30000) },
    { id: 2, amount: 100, date: new Date(Date.now() - 60000) },
    { id: 3, amount: 100, date: new Date(Date.now() - 90000) },
    { id: 4, amount: -55, date: new Date(Date.now() - 172800000) },
    { id: 5, amount: 50, date: new Date(Date.now() - 172800000) },
    { id: 6, amount: 100, date: new Date(Date.now() - 172800000) },
    { id: 7, amount: -1002, date: new Date(Date.now() - 172800000) },
    { id: 8, amount: -420, date: new Date(Date.now() - 172800000) },
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

  const handleScanQR = () => {
    // Implement QR code scanning logic here
    console.log("Scanning QR code for Lightning Network invoice");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8">
        <Balance balance={balance} />
        <Actions onScanQR={handleScanQR} onTransaction={handleTransaction} />
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
}
