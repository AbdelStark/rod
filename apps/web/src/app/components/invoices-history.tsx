import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { getInvoices } from "../../utils/storage/cashu";
import { ICashuInvoice } from "../../types/wallet";
import { useCashu } from "../../hooks/useCashu";

interface Transaction {
  id: number;
  amount: number;
  date: Date;
  description: string;
  status: "completed" | "pending" | "failed";
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  onTransactionClick: (transaction: Transaction) => void;
}

const TRANSACTIONS_PER_PAGE = 5;

const InvoicesHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onTransactionClick,
}) => {

  const { checkMintQuote } = useCashu()
  const [currentPage, setCurrentPage] = useState(1);
  const [animate, setAnimate] = useState(false);
  const [invoices, setInvoices] = useState<ICashuInvoice[] | undefined>([])

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

  useEffect(() => {


    const handleGetInvoices = async () => {
      const invoicesLocal = await getInvoices()


      if (invoicesLocal) {
        const invoices: ICashuInvoice[] = JSON.parse(invoicesLocal)
        console.log("invoices", invoices)
        setInvoices(invoices)


      }
    }
    handleGetInvoices()

  }, [])

  const handleVerify = async (quote?: string) => {

    if (!quote) return;
    console.log("quote",quote)
    const check = await checkMintQuote(quote)
    console.log("check",check)
  }

  return (
    <div>
      <h3 className="section-title mb-4">Invoices</h3>
      <div className="card">
        {invoices && invoices.length > 0 && invoices?.map((invoice) => (
          <div
            className="transaction-item px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
            key={invoice?.bolt11}
            onClick={() => {
              // onTransactionClick(tx);
            }}
          >
            <div className="flex justify-between items-center">
              <span
                className={`font-semibold ${Number(invoice?.amount) > 0 ? "text-green-400" : "text-red-400"
                  }`}
              >
                {formatAmount(Number(invoice?.amount))}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-text-secondary">
                {formatDate(new Date(invoice?.date ?? new Date()))}
              </span>
            </div>

            <div>
              <button onClick={() => handleVerify(invoice?.quote)}> Verify</button>
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

export default InvoicesHistory;
