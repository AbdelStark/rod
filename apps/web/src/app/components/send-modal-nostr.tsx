import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { NostrKeyManager } from "../../utils/nostr-key-manager";

interface Contact {
  handle: string;
  avatarUrl: string;
}

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  onSend: (amount: number, recipient: string) => void;
}

const SendModalNostr: React.FC<SendModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onSend,
}) => {
  const [amount, setAmount] = useState<string>("");
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

  const handleConfirm = async () => {
    try {
      const { secretKey } = await NostrKeyManager.getOrCreateKeyPair();
      console.log("Retrieved Nostr secret key:", secretKey);
      onSend(parseFloat(amount), recipient);
      onClose();
      setStep("amount");
      setAmount("");
      setRecipient("");
    } catch (error) {
      console.error("Error retrieving Nostr secret key:", error);
    }
  };

  return (
    <Dialog className="relative z-50" onClose={onClose} open={isOpen}>
      <div aria-hidden="true" className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-card-background p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium mb-4">
            Send Payment
          </Dialog.Title>

          {step === "amount" && (
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Amount (sats)
              </label>
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
                {contacts.map((contact) => (
                  <option key={contact.handle} value={contact.handle}>
                    {contact.handle}
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

          <div className="mt-4 flex justify-between">
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SendModalNostr;
