import React, { ChangeEvent, useState } from "react";
import { Dialog } from "@headlessui/react";
import { formatDistanceToNow } from "date-fns";
import { useCashu } from "../../hooks/useCashu";
import { MintQuoteResponse } from "@cashu/cashu-ts";
import { getInvoices, storeInvoices } from "../../utils/storage/cashu";
import { ICashuInvoice } from "../../types/wallet";
import { MINTS_URLS } from "../../utils/relay";

interface Notification {
  id: number;
  message: string;
  date: Date;
  read: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateInvoice?: () => void;
}

const ReceiveModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onGenerateInvoice,
}) => {

  const [amount, setAmount] = useState<number | undefined>()
  const [mintUrl, setMintUrl] = useState<string | undefined>(MINTS_URLS.MINIBITS)
  const [quote, setQuote] = useState<MintQuoteResponse | undefined>()
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { requestMintQuote } = useCashu()
  const handleGenerate = async () => {
    if (!amount) return;
    const quote = await requestMintQuote(amount)
    console.log("quote", quote)
    setQuote(quote?.request)

    
    const invoicesLocal = await getInvoices()


    const cashuInvoice: ICashuInvoice = {
      bolt11: quote?.request?.request,
      quote: quote?.request?.quote,
      state: quote?.request?.state,
      date: new Date().getTime(),
      amount:amount?.toString(),
      mint:mintUrl,
    }

    if (invoicesLocal) {
      const invoices: ICashuInvoice[] = JSON.parse(invoicesLocal)

      console.log("invoices",invoices)
      storeInvoices([...invoices, cashuInvoice])


    } else {
      console.log("no old invoicesLocal",invoicesLocal)

      storeInvoices([cashuInvoice])

    }
  }
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numberValue = parseFloat(value);
    console.log("numberValue", numberValue)

    // Update changeSet only if the input is a valid number
    if (!isNaN(numberValue)) {
      setAmount(numberValue);
    }
  };

  const handleCopy = async () => {
    try {
      if(!quote?.request) return;
      await navigator.clipboard.writeText(quote?.request);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset copy state after 2 seconds
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };
  return (
    <Dialog className="relative z-50" onClose={onClose} open={isOpen}>
      <div aria-hidden="true" className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-card-background p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium mb-4">
            Invoice
          </Dialog.Title>

          <input
            className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
            onChange={handleChange}
            type="number"
            value={amount}
          >
          </input>

          {quote &&
            <div>

              <div className="mb-4">
                <p className="overflow-auto max-h-64 whitespace-pre-wrap break-words">
                  {quote?.request}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {isCopied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>

          }

          <div className="mt-4 flex justify-between">


            <button
              className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
              onClick={handleGenerate}
            >
              Generate
            </button>
            <button
              className="bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
              onClick={onClose}
            >
              Close
            </button>
          </div>


        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ReceiveModal;
