import React, { ChangeEvent, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { formatDistanceToNow } from "date-fns";
import { useCashu } from "../../hooks/useCashu";
import { MintQuoteResponse } from "@cashu/cashu-ts";
import { getInvoices, storeInvoices } from "../../utils/storage/cashu";
import { ICashuInvoice } from "../../types/wallet";
import { MINTS_URLS } from "../../utils/relay";


interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateInvoice?: () => void;
}

const SendModal: React.FC<SendModalProps> = ({
  isOpen,
  onClose,
  onGenerateInvoice,
}) => {

  const [amount, setAmount] = useState<number | undefined>()
  const [ecash, setEcash] = useState<string | undefined>()
  const [invoice, setInvoice] = useState<string | undefined>()
  const [mintUrl, setMintUrl] = useState<string | undefined>(MINTS_URLS.MINIBITS)
  const [quote, setQuote] = useState<MintQuoteResponse | undefined>()
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { requestMintQuote, meltTokens } = useCashu()
  const handlePayInvoice = async () => {
    if (!invoice) return;
    const tokens = await meltTokens(invoice)
    console.log("tokens",tokens)


  }

  const handleMeltTokens = async () => {
    if (!amount) return;
    if (!invoice) return;
    const tokens = await meltTokens(invoice)


  }
  const handleChangeEcash = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numberValue = parseFloat(value);
    setInvoice(value);

  };

  const handleChangeInvoice = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numberValue = parseFloat(value);
    console.log("numberValue", numberValue)
    setInvoice(value);

  };


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
          <button
            className="bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
            onClick={onClose}
          >
            Close
          </button>
          <DialogTitle className="text-lg font-medium mb-4">
            Invoice
          </DialogTitle>


          <TabGroup>

            <TabList className={"flex gap-5"}>
              <Tab>Lightning</Tab>
              <Tab>ecash</Tab>

            </TabList>
            <TabPanels>
              <TabPanel>
                <input
                  className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                  onChange={handleChangeInvoice}
                  type="text"
                  value={invoice}
                >
                </input>
              </TabPanel>

              <TabPanel>
                <input
                  className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                  onChange={handleChangeEcash}
                  type="text"
                  value={ecash}
                >
                </input>
              </TabPanel>
            </TabPanels>
          </TabGroup>


          {/* 
          <input
            className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
            onChange={handleChangeInvoice}
            type="text"
            value={invoice}
          >
          </input> */}


          <div className="mt-4 flex justify-between">


            <button
              className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
            // onClick={handleGenerate}
            >
              Pay eCash
            </button>
            <button
              className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
            onClick={handlePayInvoice}
            >
              Pay Lightning
            </button>

          </div>


        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default SendModal;
