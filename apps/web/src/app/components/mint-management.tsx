import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { ICashuInvoice } from "../../types/wallet";
import { useCashu } from "../../hooks/useCashu";
import { TypeToast, useToast } from "../../hooks/useToast";
import { Transaction } from "../../types";
import { countMappingMint, getMintEvent, useCashuMintList } from "../../hooks/useCashuMintList";
import { useNostrContext } from "../context";

interface TransactionHistoryProps {
  transactions?: ICashuInvoice[];
  onTransactionClick: (transaction: Transaction) => void;
}

const TRANSACTIONS_PER_PAGE = 5;

const MintManagement: React.FC<TransactionHistoryProps> = ({
}) => {
  const { ndk } = useNostrContext()
  const { addToast } = useToast();
  const [mintUrls, setMintUrls] = useState<Map<string, number>>(new Map())
  const [currentPage, setCurrentPage] = useState(1);
  const [_, setAnimate] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const totalmintUrls = useMemo(() => {
    return mintUrls?.size ?? 10
  }, [mintUrls])
  const totalPages = Math.ceil(totalmintUrls / TRANSACTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
  const visibleMint = Array.from(mintUrls?.entries()).sort((a, b) => a?.[1] +  b?.[1]).slice(
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

    const getMapping = async () => {
      if (isFirstLoad) return;
      const events = await getMintEvent(ndk)
      const map = countMappingMint([...events])
      setMintUrls(map?.mintsUrlsMap)
      setIsFirstLoad(true)
    }

    if (!isFirstLoad) {
      getMapping()

    }

  }, [isFirstLoad])


  const handleCopy = async (mint?: string) => {
    try {
      if (!mint) return;
      await navigator.clipboard.writeText(mint);
      addToast({ title: "Mint copy", type: TypeToast.success })
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div>
      <h3 className="section-title mb-4">Mint</h3>
      <div className="card">
        {visibleMint && visibleMint.length > 0 && visibleMint?.map(([mint, count]) => {

          return (
            <div
              className="px-4 py-3"
            >
              <p>Count: {count}</p>

              <p
                className="overflow-auto max-h-64 whitespace-pre-wrap break-words"
                onClick={() => {
                  handleCopy(mint)
                }}> {mint}</p>
              {/* <div
              className="flex justify-between items-center hover:bg-gray-700 cursor-pointer transition-colors duration-150"
              key={mint}
              onClick={() => {
              }}
            >
            </div> */}

            </div>

          )
        })}
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

export default MintManagement;
