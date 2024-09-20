import React from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { format } from "date-fns";
import { Contact } from "../../types";
import ManageContacts from "./manage-contact";


interface TransactionModalProps {
  contacts: Contact[];
  onClose: () => void;
  isOpen: boolean;
}

const ManageContactModal: React.FC<TransactionModalProps> = ({
  contacts,
  onClose,
  isOpen
}) => {
  // console.log("contacts", contacts)
  return (
    <Dialog className="relative z-50" onClose={onClose} open={isOpen}>
      <div aria-hidden="true" className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-2xl bg-card-background p-6 shadow-xl">
          <DialogTitle className="text-lg font-medium mb-4">
            Contacts Details
          </DialogTitle>

          <ManageContacts
            contactsProps={contacts}
          ></ManageContacts>
          <button
            className="my-3 bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
            onClick={onClose}
          >
            Close
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ManageContactModal;
