import React, { ChangeEvent, useState } from "react";
import { Dialog, TabGroup, Tab, TabPanels, TabPanel, TabList } from "@headlessui/react";
import { formatDistanceToNow } from "date-fns";
import { useCashu } from "../../hooks/useCashu";
import { getDecodedToken, MintQuoteResponse, MintQuoteState } from "@cashu/cashu-ts";
import { getInvoices, storeInvoices, addProofs } from "../../utils/storage/cashu";
import { ICashuInvoice } from "../../types/wallet";
import { MINTS_URLS } from "../../utils/relay";
import { TypeToast, useToast } from "../../hooks/useToast";

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
  const { addToast } = useToast();

  const [amount, setAmount] = useState<number | undefined>()
  const [ecash, setEcash] = useState<string | undefined>()
  const [mintUrl, setMintUrl] = useState<string | undefined>(MINTS_URLS.MINIBITS)
  const [quote, setQuote] = useState<MintQuoteResponse | undefined>()
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { requestMintQuote, wallet } = useCashu()
  const handleGenerate = async () => {
    if (!amount) return;
    const quote = await requestMintQuote(amount)
    console.log("quote", quote)
    setQuote(quote?.request)


    const invoicesLocal = await getInvoices()

    const cashuInvoice: ICashuInvoice = {
      bolt11: quote?.request?.request,
      quote: quote?.request?.quote,
      state: quote?.request?.state ?? MintQuoteState.UNPAID,
      date: new Date().getTime(),
      amount: amount?.toString(),
      mint: mintUrl,
      quoteResponse: quote?.request,
    }

    if (invoicesLocal) {
      const invoices: ICashuInvoice[] = JSON.parse(invoicesLocal)

      console.log("invoices", invoices)
      storeInvoices([...invoices, cashuInvoice])


    } else {
      console.log("no old invoicesLocal", invoicesLocal)

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

  const handleChangeEcash = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEcash(value);

  };
  const handleReceiveEcash = async () => {


    if (!ecash) {
      return;
    }
    const encoded = getDecodedToken(ecash)
    console.log("encoded", encoded)


    const response = await wallet?.receive(encoded);
    console.log("response", response)

    if (response) {
      addToast("ecash payment received", TypeToast.success)
      await addProofs(response)
    }
  }

  const handleCopy = async () => {
    try {
      if (!quote?.request) return;
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

          <TabGroup>

            <TabList>
              <Tab
                className="p-3"
              >Lightning</Tab>
              <Tab>
                Ecash
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
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
              </TabPanel>
              <TabPanel>

                <input
                  className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                  onChange={handleChangeEcash}
                  type="text"
                  value={ecash}
                >
                </input>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={handleReceiveEcash}
                  >Receive ecash</button>
                </div>


              </TabPanel>
            </TabPanels>
          </TabGroup>




        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ReceiveModal;
