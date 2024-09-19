import React from "react";
import { Dialog } from "@headlessui/react";
import { format } from "date-fns";
import { Transaction } from "../../types";

interface TransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose,
}) => {
  return (
    <Dialog className="relative z-50" onClose={onClose} open>
      <div aria-hidden="true" className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-card-background p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium mb-4">
            Transaction Details
          </Dialog.Title>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-text-secondary">
                Amount
              </h3>
              <p
                className={`text-xl font-bold ${transaction.amount > 0 ? "text-green-400" : "text-red-400"}`}
              >
                {transaction.amount > 0 ? "+" : "-"}{" "}
                {Math.abs(transaction.amount)} sats
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-secondary">
                Description
              </h3>
              <p>{transaction.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-secondary">Date</h3>
              <p>{format(transaction.date, "PPpp")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-secondary">
                Status
              </h3>
              <p className="capitalize">{transaction.status}</p>
            </div>
            {transaction.recipient ? (
              <div>
                <h3 className="text-sm font-medium text-text-secondary">
                  Recipient
                </h3>
                <p>{transaction.recipient}</p>
              </div>
            ) : null}
            {transaction.sender ? (
              <div>
                <h3 className="text-sm font-medium text-text-secondary">
                  Sender
                </h3>
                <p>{transaction.sender}</p>
              </div>
            ) : null}
            {transaction.fee !== undefined && (
              <div>
                <h3 className="text-sm font-medium text-text-secondary">
                  Transaction Fee
                </h3>
                <p>{transaction.fee} sats</p>
              </div>
            )}
          </div>
          <button
            className="mt-6 w-full bg-accent text-white rounded-lg py-2 hover:bg-opacity-90 transition-colors duration-150"
            onClick={onClose}
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TransactionModal;
