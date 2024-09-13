const transactions = [
  { id: 1, amount: "-55 sat", type: "Debit", time: "2 days ago" },
  { id: 2, amount: "50 sat", type: "Credit", time: "2 days ago" },
  { id: 3, amount: "100 sat", type: "Credit", time: "2 days ago" },
  { id: 4, amount: "-1,002 sat", type: "Debit", time: "2 days ago" },
  { id: 5, amount: "-420 sat", type: "Debit", time: "2 days ago" },
];

export default function TransactionHistory() {
  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold">Transaction History</h3>
      <ul>
        {transactions.map((tx) => (
          <li className="border-b py-2 flex justify-between" key={tx.id}>
            <span>{tx.type}:</span>
            <span>{tx.amount}</span>
            <span className="text-gray-500">{tx.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
