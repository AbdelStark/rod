import React, { ChangeEvent, useState } from "react";
import { Dialog, TabGroup, Tab, TabPanels, TabPanel, TabList, DialogTitle, DialogPanel } from "@headlessui/react";
import { useCashu } from "../../hooks/useCashu";
import { getDecodedToken, MintQuoteResponse, MintQuoteState } from "@cashu/cashu-ts";
import { getInvoices, storeInvoices, addProofs } from "../../utils/storage/cashu";
import { ICashuInvoice } from "../../types/wallet";
import { MINTS_URLS } from "../../utils/relay";
import { TypeToast, useToast } from "../../hooks/useToast";


interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateInvoice?: () => void;
}

const ReceiveModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addToast } = useToast();

  const [amount, setAmount] = useState<number | undefined>()
  const [ecash, setEcash] = useState<string | undefined>()
  const [mintUrl, _] = useState<string | undefined>(MINTS_URLS.MINIBITS)
  const [quote, setQuote] = useState<MintQuoteResponse | undefined>()
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { requestMintQuote, wallet } = useCashu();

  const handleGenerate = async () => {
    if (!amount) return;
    const quote = await requestMintQuote(amount);
    console.log("quote", quote);
    setQuote(quote?.request);

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
    console.log("numberValue", numberValue);

    // Update changeSet only if the input is a valid number
    if (!isNaN(numberValue) || numberValue == 0) {
      setAmount(numberValue);
    } else {
      setAmount(0)
    }
  };

  const handleChangeEcash = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEcash(value);

  };
  const handleReceiveEcash = async () => {


    try {

      if (!ecash) {
        return;
      }
      const encoded = getDecodedToken(ecash)
      console.log("encoded", encoded)
  
  
      const response = await wallet?.receive(encoded);
      console.log("response", response)
  
      if (response) {
        addToast({ title: "ecash payment received", type: TypeToast.success })
        await addProofs(response)
      }
    }catch(e) {
      console.log("handleReceiveEcash error",e)

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
        <DialogPanel className="w-full max-w-md rounded-2xl bg-card-background p-6 shadow-xl">

          <div
            className="flex gap-3 justify-items-stretch"
          >
            <DialogTitle className="text-lg font-medium mb-4">
              Invoice
            </DialogTitle>

          </div>


          <TabGroup>

            <TabList
              className="gap-3 flex py-3"
            >
              <Tab
                className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
              >Lightning</Tab>
              <Tab
                className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                Ecash
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <input
                  className="bg-black text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                  // className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                  onChange={handleChange}
                  placeholder="Amount in satoshis"
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
                  // className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                  className="bg-black text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                  onChange={handleChangeEcash}
                  type="text"
                  placeholder="Enter token: cashuXYZ"
                  value={ecash}
                >
                </input>
                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"

                    onClick={handleReceiveEcash}
                  >Receive ecash</button>

                  <button
                    className="bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>

              </TabPanel>
            </TabPanels>
          </TabGroup>

        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ReceiveModal;
