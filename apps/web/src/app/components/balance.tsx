import React from "react";
import { EyeIcon } from "@heroicons/react/24/outline";

interface BalanceProps {
  balance: number;
}

const Balance: React.FC<BalanceProps> = ({ balance }) => {
  const formattedBalance = balance.toLocaleString();
  return (
    <div className="card p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-text-secondary">
          YOUR BALANCE
        </span>
        <EyeIcon className="w-5 h-5 text-text-secondary" />
      </div>
      <h2 className="balance-text">{formattedBalance} sats</h2>
    </div>
  );
};

export default Balance;
