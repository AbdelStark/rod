import React from "react";
import { Dialog } from "@headlessui/react";
import SendNostr from "./send-nostr";

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
}) => {

  return (
    <Dialog className="relative z-50" onClose={onClose} open={isOpen}>
      <div aria-hidden="true" className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-card-background p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium mb-4">
            Send Payment
          </Dialog.Title>
          <SendNostr
          onClose={onClose}
          ></SendNostr>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SendModalNostr;
