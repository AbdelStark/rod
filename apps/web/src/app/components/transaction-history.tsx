import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface Transaction {
  id: number;
  amount: number;
  date: Date;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TRANSACTIONS_PER_PAGE = 5;

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [animate, setAnimate] = useState(false);

  const formatAmount = (amount: number) => {
    return `${amount > 0 ? "+" : ""}${amount} sats`;
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const totalPages = Math.ceil(transactions.length / TRANSACTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const visibleTransactions = transactions.slice(
    startIndex,
    startIndex + TRANSACTIONS_PER_PAGE,
  );

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [currentPage]);

  return (
    <div>
      <h3 className="section-title mb-4">Recent Transactions</h3>
      <div className="card">
        {visibleTransactions.map((tx) => (
          <div
            className={`transaction-item px-4 ${animate ? "fade-in" : ""}`}
            key={tx.id}
          >
            <span className="text-sm text-text-secondary">
              {formatDate(tx.date)}
            </span>
            <span
              className={`font-semibold ${tx.amount > 0 ? "text-green-400" : "text-red-400"}`}
            >
              {formatAmount(tx.amount)}
            </span>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={goToPreviousPage}
          >
            <ChevronLeftIcon className="w-5 h-5 text-text-secondary" />
          </button>
          <span className="pagination-text">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-button"
            disabled={currentPage === totalPages}
            onClick={goToNextPage}
          >
            <ChevronRightIcon className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
