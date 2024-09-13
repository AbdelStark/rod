// apps/web/src/app/components/settings.tsx
"use client";

import React, { useState } from "react";
import {
  XMarkIcon,
  EyeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [selectedMint, setSelectedMint] = useState("Minibits Mint");
  const [enableNWC, setEnableNWC] = useState(false);
  const [enableLightning, setEnableLightning] = useState(false);
  const [allowance, setAllowance] = useState("10000000");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Settings</h2>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-400"
              htmlFor="mint"
            >
              Mint
            </label>
            <select
              className="w-full bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="mint"
              onChange={(e) => {
                setSelectedMint(e.target.value);
              }}
              value={selectedMint}
            >
              <option>Minibits Mint</option>
              <option>Coinos mint</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Backup seed phrase
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              Your seed phrase can restore your wallet. Keep it safe and
              private. Warning: this wallet does not support seed phrase
              recovery yet.
            </p>
            <div className="bg-gray-800 rounded p-3 flex items-center justify-between">
              <div className="flex-grow mr-2 overflow-hidden">
                <span className="text-sm">
                  ********************************************************************************
                </span>
              </div>
              <button className="text-gray-400 hover:text-white">
                <EyeIcon className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white ml-2">
                <DocumentDuplicateIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">P2PK</h3>
            <p className="text-xs text-gray-500 mb-2">
              Generate a key pair to receive P2PK-locked ecash. Warning: This
              feature is experimental. Only use with small amounts.
            </p>
            <button className="bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700 transition duration-200">
              GENERATE KEY
            </button>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Lightning address
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              Receive payments to your Lightning address.
            </p>
            <div className="flex items-center">
              <span className="text-sm mr-2">Enable</span>
              <button
                className={`${
                  enableLightning ? "bg-blue-600" : "bg-gray-600"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                onClick={() => {
                  setEnableLightning(!enableLightning);
                }}
              >
                <span
                  className={`${
                    enableLightning ? "translate-x-5" : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">
              Nostr Wallet Connect (NWC)
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              Use NWC to control your wallet from any other application.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm">Enable NWC</span>
              <button
                className={`${
                  enableNWC ? "bg-blue-600" : "bg-gray-600"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                onClick={() => {
                  setEnableNWC(!enableNWC);
                }}
              >
                <span
                  className={`${
                    enableNWC ? "translate-x-5" : "translate-x-0"
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
            <div className="mt-2">
              <label
                className="block text-sm font-medium text-gray-400 mb-1"
                htmlFor="allowance"
              >
                Allowance left (sat)
              </label>
              <input
                className="w-full bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="allowance"
                onChange={(e) => {
                  setAllowance(e.target.value);
                }}
                type="text"
                value={allowance}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
