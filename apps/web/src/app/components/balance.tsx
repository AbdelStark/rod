import React from "react";

interface BalanceProps {
  balance: number;
}

const Balance: React.FC<BalanceProps> = ({ balance }) => {
  const formattedBalance = balance.toLocaleString();
  return (
    <div className="glass-effect p-6 rounded-lg shadow-md">
      <h2 className="text-balance text-white mb-2">{formattedBalance}</h2>
      <p className="text-gray-400 text-lg uppercase tracking-wide">sats</p>
    </div>
  );
};

export default Balance;
