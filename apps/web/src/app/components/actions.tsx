// apps/web/src/app/components/actions.tsx
import React from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  QrCodeIcon,
} from "@heroicons/react/24/solid";

interface ActionsProps {
  onTransaction: (amount: number) => void;
  onScanQR: () => void;
}

const Actions: React.FC<ActionsProps> = ({ onTransaction, onScanQR }) => {
  return (
    <div className="flex justify-center space-x-4 my-8">
      <button
        className="bg-white text-black px-6 py-2 rounded-full font-semibold flex items-center"
        onClick={() => {
          onTransaction(100);
        }}
      >
        <ArrowDownIcon className="h-5 w-5 mr-2" />
        RECEIVE
      </button>
      <button
        className="bg-white text-black p-2 rounded-full"
        onClick={onScanQR}
      >
        <QrCodeIcon className="h-6 w-6" />
      </button>
      <button
        className="bg-white text-black px-6 py-2 rounded-full font-semibold flex items-center"
        onClick={() => {
          onTransaction(-100);
        }}
      >
        SEND
        <ArrowUpIcon className="h-5 w-5 ml-2" />
      </button>
    </div>
  );
};

export default Actions;
