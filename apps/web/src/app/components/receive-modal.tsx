import React from "react";
import { Dialog } from "@headlessui/react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: number;
  message: string;
  date: Date;
  read: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onGenerateInvoice: () => void;
}

const ReceiveModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onGenerateInvoice,
}) => {
  return (
    <Dialog className="relative z-50" onClose={onClose} open={isOpen}>
      <div aria-hidden="true" className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-card-background p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium mb-4">
            Invoice
          </Dialog.Title>
    
          <div className="mt-4 flex justify-between">
            <button
              className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
              onClick={onGenerateInvoice}
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
