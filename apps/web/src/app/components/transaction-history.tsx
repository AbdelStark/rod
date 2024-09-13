// apps/web/src/app/components/transaction-history.tsx
"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";

interface Transaction {
  id: number;
  amount: number;
  date: Date;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const ITEMS_PER_PAGE = 5;

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const paginationRange = () => {
    const range = [];
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="mt-8 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">History</h3>
        <button className="bg-gray-800 text-white text-sm px-3 py-1 rounded">
          FILTER PENDING
        </button>
      </div>
      <ul className="mb-4">
        {currentTransactions.map((tx) => (
          <li
            className="border-b border-gray-800 py-2 flex justify-between items-center"
            key={tx.id}
          >
            <span
              className={`${tx.amount > 0 ? "text-green-500" : "text-red-500"} flex-shrink-0`}
            >
              {tx.amount > 0 ? "↓ " : "↑ "}
              {formatAmount(Math.abs(tx.amount))} sat
            </span>
            <div className="text-right">
              <span className="text-gray-400 text-sm">Ecash</span>
              <span className="text-gray-500 text-sm block">
                {formatDate(tx.date)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            className="text-gray-400 hover:text-white disabled:text-gray-600"
            disabled={currentPage === 1}
            onClick={() => {
              goToPage(1);
            }}
          >
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          </button>
          <button
            className="text-gray-400 hover:text-white disabled:text-gray-600"
            disabled={currentPage === 1}
            onClick={() => {
              goToPage(currentPage - 1);
            }}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          {paginationRange().map((page) => (
            <button
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                currentPage === page
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
              key={page}
              onClick={() => {
                goToPage(page);
              }}
            >
              {page}
            </button>
          ))}
          <button
            className="text-gray-400 hover:text-white disabled:text-gray-600"
            disabled={currentPage === totalPages}
            onClick={() => {
              goToPage(currentPage + 1);
            }}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            className="text-gray-400 hover:text-white disabled:text-gray-600"
            disabled={currentPage === totalPages}
            onClick={() => {
              goToPage(totalPages);
            }}
          >
            <ChevronDoubleRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
