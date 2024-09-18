import React, { ChangeEvent, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { formatDistanceToNow } from "date-fns";
import { useCashu } from "../../hooks/useCashu";
import { getDecodedToken, getEncodedTokenV4, MintQuoteResponse, Proof, Token } from "@cashu/cashu-ts";
import { getInvoices, getProofs, storeInvoices, addProofs } from "../../utils/storage/cashu";
import { ICashuInvoice } from "../../types/wallet";
import { MINTS_URLS } from "../../utils/relay";
import { TypeToast, useToast } from "../../hooks/useToast";


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

  const { addToast } = useToast()
  const [amount, setAmount] = useState<number | undefined>()
  const [ecash, setEcash] = useState<string | undefined>()
  const [invoice, setInvoice] = useState<string | undefined>()
  const [mintUrl, setMintUrl] = useState<string | undefined>(MINTS_URLS.MINIBITS)
  const [quote, setQuote] = useState<MintQuoteResponse | undefined>()
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { requestMintQuote, meltTokens, payLnInvoice, sendP2PK, wallet } = useCashu()
  const handlePayInvoice = async () => {
    if (!invoice) return;
    const proofsLocal = await getProofs()

    if (proofsLocal) {
      let proofs: Proof[] = JSON.parse(proofsLocal)
      console.log("proofs", proofs)

      // Filter proofs to spent
      const lenProof = proofs?.length
      // proofs.slice(lenProof-3, lenProof)
      // const proofsKey  = proofs?.filter((p ) => p?.amount == )
      const tokens = await meltTokens(invoice, proofs?.slice(lenProof - 1, lenProof))
      console.log("tokens", tokens)

    } else {

      const tokens = await meltTokens(invoice)
      console.log("tokens", tokens)

    }


  }

  const handleGenerateEcash = async () => {

    try {
      if (!amount) {
        addToast({ title: "Please add a mint amount", type: TypeToast.warning })
        return;
      }

      if (!wallet) {
        addToast({ title: "Please connect your wallet", type: TypeToast.error })
        return;
      }

      const proofsLocal = await getProofs()
      if (proofsLocal) {
        let proofs: Proof[] = JSON.parse(proofsLocal)
        console.log("proofs", proofs)
        const proofsToUsed: Proof[] = []
        const totalAmount = proofs.reduce((s, t) => (s += t.amount), 0);
        console.log("totalAmount", totalAmount)

        let amountCounter = 0;
        for (let p of proofs) {

          amountCounter += p?.amount;
          proofsToUsed.push(p)

          if (amountCounter >= amount) {
            break;
          }
        }

        const sendCashu = await wallet?.send(amount, proofsToUsed)
        console.log("sendCashu", sendCashu)

        if (sendCashu) {
          const keysets = await wallet?.mint?.getKeySets()
          // unit of keysets
          let unit = keysets?.keysets[0].unit;

          const token = {
            token: [{ proofs: proofsToUsed, mint: wallet?.mint?.mintUrl }],
            unit: unit,
          } as Token;
          console.log("keysets", keysets)
          console.log("proofsToUsed", proofsToUsed)
          console.log("token", token)

          const cashuToken = getEncodedTokenV4(token)
          console.log("cashuToken", cashuToken)

          addToast({ title: "Cashu created", type: TypeToast?.success })

        }

      }

    } catch (e) {
      console.log("Error generate cashu token", e)
      addToast({ title: "Error when generate cashu token", type: TypeToast?.error })

    }


  }

  const handlePayEcash = async () => {
    const proofsLocal = await getProofs()

    if (proofsLocal) {
      let proofs: Proof[] = JSON.parse(proofsLocal)
      console.log("proofs", proofs)




    } else {
      if (!ecash) {
        return;
      }
      const encoded = getDecodedToken(ecash)
      console.log("encoded", encoded)

      const allProofs = encoded.token?.map((t) => t?.proofs)

      let totalAmount = 0
      allProofs?.map((pT) => pT?.map((p) => {
        totalAmount += p?.amount
      }))
      console.log("totalAmount", totalAmount)

      const response = await wallet?.send(totalAmount, encoded?.token[0]?.proofs);
      console.log("response", response)

      if (response) {
        addToast({title:"ecash payment received", type:TypeToast.success})
        await addProofs(response?.returnChange)
      }

    }
  }

  const handleChangeEcash = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEcash(value);

  };

  const handleChangeInvoice = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInvoice(value);

  };

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
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


                <div className="mt-4 flex justify-between">


                  <button
                    className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                    onClick={handlePayInvoice}
                  >
                    Pay Lightning
                  </button>

                </div>
              </TabPanel>

              <TabPanel>

                <input
                  className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                  onChange={handleChangeAmount}
                  type="number"
                  value={amount}
                >
                </input>


                {/* <input
                  className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                  onChange={handleChangeEcash}
                  type="text"
                  value={ecash}
                >
                </input> */}

                <div className="mt-4 flex justify-between">

                  <button
                    className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                    onClick={handleGenerateEcash}
                  >
                    Generate eCash
                  </button>

                </div>
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



        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default SendModal;
