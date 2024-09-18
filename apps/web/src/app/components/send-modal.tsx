import React, { ChangeEvent, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useCashu } from "../../hooks/useCashu";
import { getDecodedToken, getEncodedToken, getEncodedTokenV4, MintQuoteResponse, Proof, Token } from "@cashu/cashu-ts";
import { getProofs, } from "../../utils/storage/cashu";
import { MINTS_URLS } from "../../utils/relay";
import { TypeToast, useToast } from "../../hooks/useToast";
import { ICashuInvoice } from "../../types/wallet";
import SendNostr from "./send-nostr";


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
  const [cashuTokenCreated, setCashuTokenCreated] = useState<string | undefined>()
  const [invoice, setInvoice] = useState<string | undefined>()
  const [mintUrl, setMintUrl] = useState<string | undefined>(MINTS_URLS.MINIBITS)
  const [quote, setQuote] = useState<MintQuoteResponse | undefined>()
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { requestMintQuote, meltTokens, payLnInvoice, sendP2PK, wallet } = useCashu()
  const handlePayInvoice = async () => {
    if (!invoice) return;
    const proofsLocal = await getProofs()

    /** TODO add tx history for paid invoice/ecash */
    if (proofsLocal) {
      let proofs: Proof[] = JSON.parse(proofsLocal)
      console.log("proofs", proofs)

      // Filter proofs to spent

      /** TODO better filter of proof based on keysets */
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

        const proofsSpent = await wallet?.checkProofsSpent(proofs)
        console.log("proofsSpent", proofsSpent)

        proofs = proofs?.filter((p) => {
          if (!proofsSpent?.includes(p)) {
            return p;
          }
        })
        console.log("proofs", proofs)
        const proofsToUsed: Proof[] = []
        const totalAmount = proofs.reduce((s, t) => (s += t.amount), 0);
        console.log("totalAmount", totalAmount)



        let amountCounter = 0;
        for (let p of proofs?.reverse()) {

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

          const cashuToken = getEncodedToken(token)
          console.log("cashuToken", cashuToken)
          setCashuTokenCreated(cashuToken)

          addToast({ title: "Cashu created", type: TypeToast?.success })

        }

      }

    } catch (e) {
      console.log("Error generate cashu token", e)
      addToast({ title: "Error when generate cashu token", type: TypeToast?.error })

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

    // Update changeSet only if the input is a valid number
    if (!isNaN(numberValue)) {
      setAmount(numberValue);
    }

  };

  const handleCopyCashuToken = async () => {
    try {
      if (!cashuTokenCreated) return;
      await navigator.clipboard.writeText(cashuTokenCreated);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset copy state after 2 seconds
      addToast({ title: "Copy successfully", type: TypeToast.success })
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
            className="flex gap-3 justify-items-evenly justify-between"
          >
            <DialogTitle className="text-lg font-medium mb-4">
              Send
            </DialogTitle>
            <button
              className="bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
              onClick={onClose}
            >
              Close
            </button>

          </div>

          <TabGroup>

            <TabList className={"flex gap-5 py-3"}>
              <Tab
                className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
              >Lightning</Tab>
              <Tab
                // className="data-[selected]:bg-blue-500 data-[selected]:text-white data-[hover]:underline"
                className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
              >eCash</Tab>

              <Tab
                // className="data-[selected]:bg-blue-500 data-[selected]:text-white data-[hover]:underline"
                className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
              >Nostr</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <input
                  className="bg-black text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
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
                  className="bg-black text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                  onChange={handleChangeAmount}
                  type="number"
                  value={amount}
                >
                </input>

                {cashuTokenCreated &&

                  <div className="mt-4 flex justify-between">
                    <p className="overflow-auto max-h-64 whitespace-pre-wrap break-words"
                      onClick={handleCopyCashuToken}
                    >
                      {cashuTokenCreated}
                    </p>
                  </div>
                }

                <div className="mt-4 flex justify-between">

                  <button
                    className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
                    onClick={handleGenerateEcash}
                  >
                    Generate eCash
                  </button>

                </div>
              </TabPanel>
              <TabPanel>
                <SendNostr></SendNostr>
              </TabPanel>
            </TabPanels>
          </TabGroup>

        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default SendModal;
