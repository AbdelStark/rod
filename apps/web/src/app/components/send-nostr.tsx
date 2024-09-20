import React, { useState } from "react";
import { NostrKeyManager } from "../../utils/nostr-key-manager";
import { CONTACTS_DATA } from "../constants/data";
import { Contact } from "../../types";
import { useCashuStore } from "../../store";
import { TypeToast, useToast } from "../../hooks/useToast";


interface SendModalProps {
  onClose?: () => void;
}

const SendNostr: React.FC<SendModalProps> = ({
  onClose
}) => {

  const { addToast } = useToast()

  const { contacts, setContacts } = useCashuStore()
  console.log("contacts", contacts)
  // const [contacts, _] = useState<Contact[]>(CONTACTS_DATA)
  const [amount, setAmount] = useState<string>("");
  const [contactSelected, setContactSelected] = useState<Contact | undefined>()
  const [recipient, setRecipient] = useState<string>("");
  const [step, setStep] = useState<"amount" | "recipient" | "confirm">(
    "amount",
  );

  const handleNext = () => {
    if (step === "amount" && amount) {
      setStep("recipient");
    } else if (step === "recipient" && recipient) {
      setStep("confirm");
    }
  };

  const handleBack = () => {
    if (step === "recipient") {
      setStep("amount");
    } else if (step === "confirm") {
      setStep("recipient");
    }
  };


  const onTipPress = async (contact:Contact) => {

    if (!event) return;

    if (!amount) {

      addToast({ title: "Zap send", type: "error" })
      return;
    }

    if (!contact?.lud16) {
      addToast({ title: "This profile doesn't have a lud16 Lightning address", type: "error" })
      return;
    }

    // const invoice = await getInvoiceFromLnAddress(contact?.lud16, Number(amount))
    // console.log("invoice", invoice)
    // const zapExtension = await handleZap(amount, invoice?.paymentRequest)
    // const zapExtension = await payInvoice(invoice?.paymentRequest)
    // console.log("zapExtension", zapExtension)

  };

  const handleConfirm = async () => {
    try {
      // const { secretKey } = await NostrKeyManager.getOrCreateKeyPair();
      // console.log("Retrieved Nostr secret key:", secretKey);
      // onSend(parseFloat(amount), recipient);
      if(!contactSelected) {

        return addToast({
          title:"Please select a contact",
          type:TypeToast.success
        })
      }
      onTipPress(contactSelected)
      onClose && onClose();
      setStep("amount");
      setAmount("");
      setRecipient("");
    } catch (error) {
      console.error("Error retrieving Nostr secret key:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center">

        {step === "amount" && (
          <div>
            <p className="block text-sm font-medium text-text-secondary mb-2">
              Amount (sats)
            </p>
            <input
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              placeholder="Enter amount"
              type="number"
              value={amount}
            />
          </div>
        )}

        {step === "recipient" && (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Recipient
            </label>
            <select
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent mb-2"
              onChange={(e) => {
                setRecipient(e.target.value);
              }}
              value={recipient}
            >
              <option value="">Select a contact</option>
              {contacts?.map((contact) => (
                <option key={contact?.pubkey} value={contact.displayName}
                  onSelect={() => {
                    setContactSelected(contact)
                    console.log("contact selected", contact)
                  }}
                >
                  {contact?.displayName ? contact?.displayName :
                    contact?.lud16 ? contact?.lud16
                      : contact?.pubkey
                  }
                </option>
              ))}
            </select>
            <input
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              onChange={(e) => {
                setRecipient(e.target.value);
              }}
              placeholder="Or paste an address"
              type="text"
              value={recipient}
            />
          </div>
        )}

        {step === "confirm" && (
          <div>
            <p className="text-text-secondary mb-2">
              Confirm payment of {amount} sats to {recipient}
            </p>
            <button
              className="w-full bg-accent text-white rounded-lg py-2 hover:bg-opacity-90 transition-colors duration-150"
              onClick={handleConfirm}
            >
              Confirm Payment
            </button>
          </div>
        )}


      </div>
      <div className="mt-4 flex justify-between justfiy-center items-center">
        {step !== "amount" && (
          <button
            className="bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
            onClick={handleBack}
          >
            Back
          </button>
        )}
        {step !== "confirm" && (
          <button
            className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
            disabled={
              (!amount && step === "amount") ||
              (!recipient && step === "recipient")
            }
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
    </div>

  );
};

export default SendNostr;
