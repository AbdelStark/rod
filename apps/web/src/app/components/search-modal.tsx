import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Contact } from "../../types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  contacts,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact?.nip05?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Dialog className="relative z-50" onClose={onClose} open={isOpen}>
      <div aria-hidden="true" className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-2xl bg-card-background p-6 shadow-xl">
          <DialogTitle className="text-lg font-medium mb-4">
            Search Contacts
          </DialogTitle>
          <div className="relative mb-4">
            <input
              className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              placeholder="Search by handle..."
              type="text"
              value={searchTerm}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <div
                className="flex items-center p-2 hover:bg-gray-700 rounded-lg transition-colors duration-150"
                key={contact?.nip05}
              >
                <img
                  alt={contact.nip05}
                  className="w-10 h-10 rounded-full mr-3"
                  src={contact?.image}
                />
                <span>{contact?.nip05}</span>
              </div>
            ))}
          </div>
          <button
            className="mt-4 w-full bg-accent text-white rounded-lg py-2 hover:bg-opacity-90 transition-colors duration-150"
            onClick={onClose}
          >
            Close
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default SearchModal;
