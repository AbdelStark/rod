// apps/web/src/app/components/transaction-history.tsx
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
  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="mt-8 w-full max-w-md">
      <h3 className="text-xl font-semibold mb-4">History</h3>
      <ul>
        {transactions.map((tx) => (
          <li
            className="border-b border-gray-800 py-2 flex justify-between items-center"
            key={tx.id}
          >
            <span
              className={`${tx.amount > 0 ? "text-green-500" : "text-red-500"} flex-shrink-0`}
            >
              {tx.amount > 0 ? "+" : ""}
              {formatAmount(tx.amount)} sat
            </span>
            <span className="text-gray-500 text-sm ml-4 text-right">
              {formatDate(tx.date)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
