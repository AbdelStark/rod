// src/app/components/balance.tsx
import React from "react";

interface BalanceProps {
  balance: number;
  weeklyAverage: number;
}

const Balance: React.FC<BalanceProps> = ({ balance, weeklyAverage }) => {
  const percentage = (balance / weeklyAverage) * 100;

  return (
    <div className="text-center">
      <div className="text-white text-3xl font-bold">
        {balance.toLocaleString()} sat
      </div>
      <div className="text-gray-300 text-sm mt-2">
        {percentage.toFixed(0)}% of weekly average
      </div>
    </div>
  );
};

export default Balance;
