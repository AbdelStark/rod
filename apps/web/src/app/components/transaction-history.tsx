import React, { useState, useEffect, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { getTransactions } from "../../utils/storage/cashu";
import { ICashuInvoice } from "../../types/wallet";
import { MintQuoteState } from "@cashu/cashu-ts";

interface Transaction {
  id: number;
  amount: number;
  date: Date;
  description: string;
  status: "completed" | "pending" | "failed";
}

interface TransactionHistoryProps {
  transactions?: ICashuInvoice[];
  onTransactionClick: (transaction: Transaction) => void;
}

const TRANSACTIONS_PER_PAGE = 5;

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onTransactionClick,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [animate, setAnimate] = useState(false);
  const [txInvoices, setTxInvoices] = useState<ICashuInvoice[] | undefined>([])

  const totalInvoices = useMemo(() => {

    return txInvoices?.length ?? 10
  }, [txInvoices])
  const formatAmount = (amount: number) => {
    return `${amount > 0 ? "+" : ""}${amount} sats`;
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const totalPages = Math.ceil(totalInvoices / TRANSACTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const visibleTransactions = txInvoices?.reverse().slice(
    // const visibleTransactions = txInvoices?.reverse().slice(
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

  useEffect(() => {
    const handleGetInvoices = async () => {
      const invoicesLocal = await getTransactions()


      if (invoicesLocal) {
        const invoices: ICashuInvoice[] = JSON.parse(invoicesLocal)
        const invoicesPaid = invoices.filter((i) => i?.state == MintQuoteState?.ISSUED || i?.state == MintQuoteState.PAID)
        setTxInvoices(invoicesPaid?.reverse())

      }
    }
    handleGetInvoices()
  }, [])

  return (
    <div>
      <h3 className="section-title mb-4">Recent Transactions</h3>
      <div className="card">
        {visibleTransactions && visibleTransactions?.length > 0 && visibleTransactions?.map((tx) => (
          <div
            className="transaction-item px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
            key={tx.bolt11}
            onClick={() => {
              // onTransactionClick(tx);
            }}
          >
            <div className="flex justify-between items-center">
              <span
                className={`font-semibold ${Number(tx.amount) > 0 ? "text-green-400" : "text-red-400"
                  }`}
              >
                {formatAmount(Number(tx.amount))}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-text-secondary">
                {formatDate(new Date(tx?.date ?? new Date()))}
              </span>
            </div>
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
