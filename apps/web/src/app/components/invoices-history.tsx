import React, { useState, useEffect, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { getInvoices, getProofs, storeInvoices, storeProofs, storeTransactions } from "../../utils/storage/cashu";
import { ICashuInvoice } from "../../types/wallet";
import { useCashu } from "../../hooks/useCashu";
import { TypeToast, useToast } from "../../hooks/useToast";
import { getEncodedToken, MintQuoteState, Proof } from "@cashu/cashu-ts";

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

const InvoicesHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onTransactionClick,
}) => {

  const { wallet, mint, checkMintQuote, receiveP2PK, mintTokens } = useCashu()
  const { addToast } = useToast();
  const [invoices, setInvoices] = useState<ICashuInvoice[] | undefined>([])

  const [currentPage, setCurrentPage] = useState(1);
  const [animate, setAnimate] = useState(false);

  const totalInvoices = useMemo(() => {

    return invoices?.length ?? 10
  }, [invoices])

  const formatAmount = (amount: number) => {
    return `${amount > 0 ? "+" : ""}${amount} sats`;
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const totalPages = Math.ceil(totalInvoices / TRANSACTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const visibleInvoices = invoices?.slice(
    // const visibleInvoices = invoices?.reverse().slice(
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
        setInvoices(invoices?.reverse())

      }
    }
    handleGetInvoices()

  }, [])

  const handleVerify = async (quote?: string) => {

    console.log("handleVerify")
    if (!quote) return;
    console.log("quote", quote)
    const check = await checkMintQuote(quote)
    console.log("check", check)
    if (check?.state == MintQuoteState.UNPAID) {
      addToast({ title: "Unpaid", type: TypeToast.warning })
    }
    else if (check?.state == MintQuoteState.PAID) {
      addToast({ title: "Invoice is paid", type: TypeToast.success })
      const invoice = invoices?.find((i) => i?.quote == quote)

      const invoicesUpdated = invoices?.map((i) => {
        if (i?.quote == quote) {
          i.state = MintQuoteState.PAID

          return i;
        }
        return i;
      }) ?? []

      storeInvoices(invoicesUpdated)
      storeTransactions(invoicesUpdated)

      if (invoice && invoice?.quote) {

        const received = await handleReceivePaymentPaid(invoice)

        if (received) {
          addToast({ title: "Payment received", type: TypeToast.success })
        }

      }
    }
    else if (check?.state == MintQuoteState.ISSUED) {
      addToast({ title: "Invoice is paid", type: TypeToast.success })
      const invoice = invoices?.find((i) => i?.quote == quote)
      const invoicesUpdated = invoices?.map((i) => {
        if (i?.quote == quote) {
          i.state = MintQuoteState.PAID
          return i;
        }
        return i;
      }) ?? []
      storeInvoices(invoicesUpdated)
      storeTransactions(invoicesUpdated)
      if (invoice && invoice?.quote) {
        const received = await handleReceivePaymentPaid(invoice)
        if (received) {
          addToast({ title: "Received", type: TypeToast.success })
        }
      }
    }

  }

  const handleReceivePaymentPaid = async (invoice: ICashuInvoice) => {
    if (invoice?.amount && invoice?.quoteResponse) {
      const receive = await mintTokens(Number(invoice?.amount), invoice?.quoteResponse)
      console.log("receive", receive)

      const encoded = getEncodedToken({
        token: [{ mint: mint?.mintUrl, proofs: receive?.proofs as Proof[] }]
      });
      // const response = await wallet?.receive(encoded);
      const response = await receiveP2PK(encoded);
      console.log("response", response)
      const proofsLocal = await getProofs()
      console.log("response", response)
      if (!proofsLocal) {
        setInvoices(invoices)
        await storeProofs([...receive?.proofs as Proof[], ...response as Proof[]])
      } else {
        const proofs: Proof[] = JSON.parse(proofsLocal)
        console.log("invoices", invoices)
        setInvoices(invoices)
        console.log("receive", receive)
        await storeProofs([...proofs, ...receive?.proofs as Proof[], ...response as Proof[]])
      }

      return response;
    }

  }

  const handleCopy = async (quote?: string) => {
    try {
      if (!quote) return;
      await navigator.clipboard.writeText(quote);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };
  return (
    <div>
      <h3 className="section-title mb-4">Invoices</h3>
      <div className="card">
        {visibleInvoices && visibleInvoices.length > 0 && visibleInvoices?.map((invoice) => (
          <div
            className="px-4 py-3"
          >

            <div>State: {invoice?.state}</div>

            <div
              className="flex justify-between items-center hover:bg-gray-700 cursor-pointer transition-colors duration-150"

              key={invoice?.bolt11}
              onClick={() => {
                // onTransactionClick(tx);
              }}
            >
              <div className="flex justify-between items-center ">
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
              <div
                className="p-1"
              >
                <button
                  onClick={() => handleVerify(invoice?.quote)}> Verify</button>
              </div>
              <div
                className="p-1"
              >
                <button onClick={() => handleCopy(invoice?.bolt11)}> Copy</button>

              </div>

            </div>

            {/* <div
              className="transaction-item px-4 py-3  transition-colors duration-150"
            >
              <div
                className="p-1"
              >
                <button
                  onClick={() => handleVerify(invoice?.quote)}> Verify</button>
              </div>
              <div
                className="p-1"
              >
                <button onClick={() => handleCopy(invoice?.quote)}> Copy</button>

              </div>
            </div> */}

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
