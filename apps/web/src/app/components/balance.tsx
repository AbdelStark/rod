"use client";

// apps/web/src/app/components/balance.tsx
import React from "react";

interface BalanceProps {
  balance: number;
}

const Balance: React.FC<BalanceProps> = ({ balance }) => {
  const formattedBalance = balance.toLocaleString();
  return (
    <div className="text-center my-8">
      <h2 className="text-4xl font-bold">{formattedBalance} sats</h2>
    </div>
  );
};

export default Balance;
