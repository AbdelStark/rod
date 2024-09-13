"use client";

import { useState } from "react";

function Gradient({
  conic,
  className,
  small,
}: {
  small?: boolean;
  conic?: boolean;
  className?: string;
}): JSX.Element {
  return (
    <span
      className={`absolute mix-blend-normal will-change-[filter] rounded-[100%] ${
        small ? "blur-[32px]" : "blur-[75px]"
      } ${conic ? "bg-glow-conic" : ""} ${className}`}
    />
  );
}

export default function Page(): JSX.Element {
  const [balance, setBalance] = useState(10760);
  const [transactions, setTransactions] = useState([
    { id: 1, amount: "-55 sat", type: "Debit", time: "2 days ago" },
    { id: 2, amount: "50 sat", type: "Credit", time: "2 days ago" },
    { id: 3, amount: "100 sat", type: "Credit", time: "2 days ago" },
    { id: 4, amount: "-1,002 sat", type: "Debit", time: "2 days ago" },
    { id: 5, amount: "-420 sat", type: "Debit", time: "2 days ago" },
  ]);

  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const handleSend = () => {
    if (amount && recipient) {
      setTransactions((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          amount: `-${amount} sat`,
          type: "Debit",
          time: "just now",
        },
      ]);
      setBalance((prev) => prev - parseInt(amount));
      setAmount("");
      setRecipient("");
    }
  };

  const handleReceive = () => {
    if (amount) {
      setTransactions((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          amount: `+${amount} sat`,
          type: "Credit",
          time: "just now",
        },
      ]);
      setBalance((prev) => prev + parseInt(amount));
      setAmount("");
    }
  };

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <div className="relative flex place-items-center ">
        <div className="font-sans w-auto pb-16 pt-[48px] md:pb-24 lg:pb-32 md:pt-16 lg:pt-20 flex justify-between gap-8 items-center flex-col relative z-0">
          <div className="z-50 flex items-center justify-center w-full">
            <div className="absolute min-w-[614px] min-h-[614px]">
              {/* Add relevant images here if needed */}
            </div>

            <div className="z-50 text-center">
              <h1 className="text-4xl font-bold">Your Wallet</h1>
              <h2 className="text-3xl font-semibold mt-4">
                Balance: {balance} sat
              </h2>
            </div>
          </div>

          <Gradient
            className="top-[-500px] opacity-[0.15] w-[1000px] h-[1000px]"
            conic
          />

          {/* Send Form */}
          <div className="z-50 w-full max-w-md mt-8">
            <h3 className="text-2xl font-semibold">Send Satoshis</h3>
            <input
              className="w-full mt-2 p-2 border rounded"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              placeholder="Amount"
              type="number"
              value={amount}
            />
            <input
              className="w-full mt-2 p-2 border rounded"
              onChange={(e) => {
                setRecipient(e.target.value);
              }}
              placeholder="Recipient"
              type="text"
              value={recipient}
            />
            <button
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
              onClick={handleSend}
            >
              Send
            </button>
          </div>

          {/* Receive Form */}
          <div className="z-50 w-full max-w-md mt-8">
            <h3 className="text-2xl font-semibold">Receive Satoshis</h3>
            <input
              className="w-full mt-2 p-2 border rounded"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              placeholder="Amount"
              type="number"
              value={amount}
            />
            <button
              className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-700"
              onClick={handleReceive}
            >
              Receive
            </button>
          </div>

          {/* Transaction History */}
          <div className="z-50 w-full max-w-md mt-8">
            <h3 className="text-2xl font-semibold">Transaction History</h3>
            <ul className="mt-4 border rounded p-4">
              {transactions.map((tx) => (
                <li
                  className="flex justify-between py-2 border-b last:border-b-0"
                  key={tx.id}
                >
                  <span>{tx.type}:</span>
                  <span>{tx.amount}</span>
                  <span className="text-gray-500">{tx.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
