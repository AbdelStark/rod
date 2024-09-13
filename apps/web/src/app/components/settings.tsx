// src/app/components/settings.tsx
"use client";

import React, { useState } from "react";

const Settings: React.FC = () => {
  const [enableNWC, setEnableNWC] = useState(false);

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Mint
          </label>
          <select className="w-full bg-gray-700 text-white px-3 py-2 rounded">
            <option>Minibits Mint</option>
            <option>Coinos Mint</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-400">Enable NWC</span>
          <button
            className={`${
              enableNWC ? "bg-blue-500" : "bg-gray-600"
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
        <button className="w-full bg-blue-500 text-white py-2 rounded">
          Backup Nostr Secret Key
        </button>
      </div>
    </div>
  );
};

export default Settings;
