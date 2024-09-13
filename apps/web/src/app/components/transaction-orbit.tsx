// src/app/components/transaction-orbit.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

interface Transaction {
  id: number;
  amount: number;
  date: Date;
}

interface TransactionOrbitProps {
  transactions: Transaction[];
}

const TransactionOrbit: React.FC<TransactionOrbitProps> = ({
  transactions,
}) => {
  return (
    <>
      {transactions.slice(0, 5).map((tx, index) => (
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          className={`absolute w-8 h-8 rounded-full ${tx.amount > 0 ? "bg-green-500" : "bg-red-500"}`}
          key={tx.id}
          style={{
            top: `${50 - 40 * Math.cos(index * (Math.PI / 2.5))}%`,
            left: `${50 + 40 * Math.sin(index * (Math.PI / 2.5))}%`,
          }}
          transition={{
            rotate: {
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      ))}
    </>
  );
};

export default TransactionOrbit;
