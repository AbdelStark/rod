// src/app/components/transaction-history.tsx
"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: number;
  amount: number;
  date: Date;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      {transactions.map((tx) => (
        <div
          className="flex justify-between items-center mb-2 pb-2 border-b border-gray-700"
          key={tx.id}
        >
          <div className={tx.amount > 0 ? "text-green-500" : "text-red-500"}>
            {tx.amount > 0 ? "+" : ""}
            {tx.amount} sats
          </div>
          <div className="text-gray-400 text-sm">
            {formatDistanceToNow(tx.date, { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;
