import React from "react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: number;
  amount: number;
  date: Date;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
}) => {
  const formatAmount = (amount: number) => {
    return `${amount > 0 ? "+" : ""}${amount} sats`;
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div>
      <h3 className="section-title mb-4">Recent Transactions</h3>
      <div className="card">
        {transactions.map((tx) => (
          <div className="transaction-item px-4" key={tx.id}>
            <span className="text-sm text-text-secondary">
              {formatDate(tx.date)}
            </span>
            <span
              className={`font-semibold ${tx.amount > 0 ? "text-green-400" : "text-red-400"}`}
            >
              {formatAmount(tx.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
