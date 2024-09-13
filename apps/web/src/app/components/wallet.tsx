import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { formatDistanceToNow } from 'date-fns';

function Wallet() {
  const [balance, setBalance] = useState(10760);
  const [weeklyAverage] = useState(15000);
  const [transactions, setTransactions] = useState([
    { id: 1, amount: -55, date: new Date(Date.now() - 172800000) },
    { id: 2, amount: 50, date: new Date(Date.now() - 172800000) },
    { id: 3, amount: 100, date: new Date(Date.now() - 172800000) },
    { id: 4, amount: -1002, date: new Date(Date.now() - 172800000) },
    { id: 5, amount: -420, date: new Date(Date.now() - 172800000) },
  ]);

  const maxAmount = Math.max(...transactions.map(tx => Math.abs(tx.amount)));

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="relative w-96 h-96 mb-8">
        <motion.div 
          animate={{
            scale: [1, 1.05, 1],
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-t from-blue-500 to-purple-600 flex flex-col items-center justify-center"
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity,
          }}
        >
          <div className="text-white text-5xl font-bold">{balance.toLocaleString()} sat</div>
          <div className="text-gray-300 text-lg mt-2">
            {((balance / weeklyAverage) * 100).toFixed(0)}% of weekly average
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <button className="bg-white text-black px-6 py-2 rounded-full font-semibold flex items-center">
              <ArrowDownIcon className="h-5 w-5 mr-2" />
              RECEIVE
            </button>
            <button className="bg-white text-black px-6 py-2 rounded-full font-semibold flex items-center">
              SEND
              <ArrowUpIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
        </motion.div>
        {transactions.slice(0, 5).map((tx, index) => {
          const size = 30 + (Math.abs(tx.amount) / maxAmount) * 30;
          return (
            <motion.div
              animate={{
                rotate: 360,
              }}
              className={`absolute rounded-full ${tx.amount > 0 ? 'bg-green-500' : 'bg-red-500'} flex flex-col items-center justify-center text-white font-bold`}
              key={tx.id}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${50 - 55 * Math.cos(index * (Math.PI / 2.5))}%`,
                left: `${50 + 55 * Math.sin(index * (Math.PI / 2.5))}%`,
              }}
              transition={{
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            >
              <div>{Math.abs(tx.amount)}</div>
              <div className="text-xs">{formatDistanceToNow(tx.date, { addSuffix: true })}</div>
            </motion.div>
          );
        })}
      </div>
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4 text-white">Transaction History</h2>
        {transactions.map((tx) => (
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-700" key={tx.id}>
            <div className={`${tx.amount > 0 ? 'text-green-500' : 'text-red-500'} font-semibold`}>
              {tx.amount > 0 ? '+' : ''}{tx.amount} sat
            </div>
            <div className="text-gray-400 text-sm">
              {formatDistanceToNow(tx.date, { addSuffix: true })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wallet;