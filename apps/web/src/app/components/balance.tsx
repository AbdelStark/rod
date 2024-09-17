import React, { useState } from "react";
import { EyeIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import type { CurrencyUnit } from "../../utils/currency-utils";
import { formatBalance } from "../../utils/currency-utils";

interface BalanceProps {
  balance: number;
}

const Balance: React.FC<BalanceProps> = ({ balance }) => {
  const [unit, setUnit] = useState<CurrencyUnit>("sats");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const changeUnit = (newUnit: CurrencyUnit) => {
    setUnit(newUnit);
    setIsDropdownOpen(false);
  };

  return (
    <div className="card p-4 mb-6 relative">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-text-secondary">
          YOUR BALANCE
        </span>
        <EyeIcon className="w-5 h-5 text-text-secondary" />
      </div>
      <div
        className="flex items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <h2 className="balance-text mr-2">{formatBalance(balance, unit)}</h2>
        <ChevronDownIcon className="w-5 h-5 text-text-secondary" />
      </div>
      {isDropdownOpen ? (
        <div className="absolute top-full left-0 mt-2 w-full bg-card-background rounded-md shadow-lg z-10 py-1">
          <button
            className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-700"
            onClick={() => {
              changeUnit("sats");
            }}
          >
            Satoshis (sats)
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-700"
            onClick={() => {
              changeUnit("btc");
            }}
          >
            Bitcoin (BTC)
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-700"
            onClick={() => {
              changeUnit("usd");
            }}
          >
            US Dollar (USD)
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Balance;
