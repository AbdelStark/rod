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
    <div className="flex justify-center space-x-6 my-12">
      <button
        className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-full font-semibold flex items-center transition-all duration-200 hover:from-gray-600 hover:to-gray-700 shadow-md hover:shadow-lg"
        onClick={() => {
          onTransaction(100);
        }}
      >
        <ArrowDownIcon className="h-5 w-5 mr-2" />
        RECEIVE
      </button>
      <button
        className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-3 rounded-full transition-all duration-200 hover:from-gray-700 hover:to-gray-800 shadow-md hover:shadow-lg"
        onClick={onScanQR}
      >
        <QrCodeIcon className="h-6 w-6" />
      </button>
      <button
        className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-full font-semibold flex items-center transition-all duration-200 hover:from-gray-600 hover:to-gray-700 shadow-md hover:shadow-lg"
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
