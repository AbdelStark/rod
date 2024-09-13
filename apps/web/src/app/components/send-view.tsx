// src/app/components/send-view.tsx
"use client";

import React, { useState } from "react";

interface SendViewProps {
  onSend: (amount: number) => void;
}

const SendView: React.FC<SendViewProps> = ({ onSend }) => {
  const [amount, setAmount] = useState("");

  const handleSend = () => {
    const numAmount = parseInt(amount);
    if (!isNaN(numAmount)) {
      onSend(-numAmount);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Send Sats</h2>
      <input
        className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-4"
        onChange={(e) => {
          setAmount(e.target.value);
        }}
        placeholder="Amount in sats"
        type="number"
        value={amount}
      />
      <button
        className="w-full bg-blue-500 text-white py-2 rounded"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default SendView;
