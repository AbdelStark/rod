export default function WalletBalance() {
  const balance = 10760; // hardcoded for now

  return (
    <div className="text-center my-8">
      <h2 className="text-3xl font-bold">Balance: {balance} sat</h2>
    </div>
  );
}
