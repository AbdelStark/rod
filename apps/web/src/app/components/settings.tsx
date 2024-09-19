import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  EyeIcon,
  EyeSlashIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { useCashuStore } from "../../store";
import { TypeToast, useToast } from "../../hooks/useToast";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {


  const {mnemonic} = useCashuStore()
  const [seedPhrase, ] = useState(
    mnemonic ??
    "******** ******** ****** ***** **** ******* ****** ***** **** ***** **** *****",
  );
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [lightningEnabled, setLightningEnabled] = useState(false);
  const [nwcEnabled, setNwcEnabled] = useState(false);
  const [nwcAllowance, setNwcAllowance] = useState("10000000");

  const {addToast} = useToast()

  const toggleSeedPhraseVisibility = () => {
    setShowSeedPhrase(!showSeedPhrase);
  };

  const copySeedPhrase = () => {
    navigator.clipboard.writeText(seedPhrase);
    addToast({title:"Seed copied", type:TypeToast.success})
    // You might want to show a toast or notification here
  };

  const generateP2PKKey = () => {
    // Implement P2PK key generation logic here
    console.log("Generating P2PK key...");
  };

  return (
    <Dialog className="relative z-50" onClose={onClose} open={isOpen}>
      <div aria-hidden="true" className="fixed inset-0 bg-black/80" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-2xl bg-gray-900 p-6 text-white">
          <DialogTitle className="text-lg font-medium mb-4">
            Settings
          </DialogTitle>

          <div className="space-y-6">
            {/* Backup seed phrase */}
            <div>
              <h3 className="text-sm font-medium mb-2">Backup seed phrase</h3>
              <p className="text-xs text-gray-400 mb-2">
                Your seed phrase can restore your wallet. Keep it safe and
                private. Warning: this wallet does not support seed phrase
                recovery yet.
              </p>
              <div className="relative">
                <input
                  className="w-full bg-gray-800 rounded-md p-2 pr-20 text-sm"
                  readOnly
                  type={showSeedPhrase ? "text" : "password"}
                  value={seedPhrase}
                />
                <button
                  className="absolute right-10 top-1/2 transform -translate-y-1/2"
                  onClick={toggleSeedPhraseVisibility}
                >
                  {showSeedPhrase ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={copySeedPhrase}
                >
                  <ClipboardIcon className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* P2PK */}
            <div>
              <h3 className="text-sm font-medium mb-2">P2PK</h3>
              <p className="text-xs text-gray-400 mb-2">
                Generate a key pair to receive P2PK-locked ecash. Warning: This
                feature is experimental. Only use with small amounts.
              </p>
              <button
                className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm hover:bg-blue-700 transition-colors"
                onClick={generateP2PKKey}
              >
                Generate Key
              </button>
            </div>

            {/* Lightning address */}
            <div>
              <h3 className="text-sm font-medium mb-2">Lightning address</h3>
              <p className="text-xs text-gray-400 mb-2">
                Receive payments to your Lightning address.
              </p>
              <div className="flex items-center">
                <span className="mr-2 text-sm">Enable</span>
                <label className="switch">
                  <input
                    checked={lightningEnabled}
                    onChange={() => {
                      setLightningEnabled(!lightningEnabled);
                    }}
                    type="checkbox"
                  />
                  <span className="slider round" />
                </label>
              </div>
              {lightningEnabled ? (
                <p className="text-xs text-gray-400 mt-2">
                  Your wallet will check for incoming payments at every startup.
                </p>
              ) : null}
            </div>

            {/* Nostr Wallet Connect (NWC) */}
            <div>
              <h3 className="text-sm font-medium mb-2">
                Nostr Wallet Connect (NWC)
              </h3>
              <p className="text-xs text-gray-400 mb-2">
                Use NWC to control your wallet from any other application.
              </p>
              <div className="flex items-center">
                <span className="mr-2 text-sm">Enable NWC</span>
                <label className="switch">
                  <input
                    checked={nwcEnabled}
                    onChange={() => {
                      setNwcEnabled(!nwcEnabled);
                    }}
                    type="checkbox"
                  />
                  <span className="slider round" />
                </label>
              </div>
              {nwcEnabled ? (
                <>
                  <p className="text-xs text-gray-400 mt-2">
                    You can only use NWC for payments from your Bitcoin balance.
                    Payments will be made from your active mint.
                  </p>
                  <div className="mt-2">
                    <label className="text-xs text-gray-400">
                      Allowance left (sat)
                    </label>
                    <input
                      className="w-full bg-gray-800 rounded-md p-2 mt-1 text-sm"
                      onChange={(e) => {
                        setNwcAllowance(e.target.value);
                      }}
                      type="number"
                      value={nwcAllowance}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <button
            className="mt-6 w-full bg-gray-700 text-white rounded-lg py-2 hover:bg-gray-600 transition-colors duration-150"
            onClick={onClose}
          >
            Close
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default Settings;
