import React, { ChangeEvent, useEffect, useState } from "react";
import { EyeIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import type { CurrencyUnit } from "../../utils/currency-utils";
import { formatBalance } from "../../utils/currency-utils";
import { useCashu } from "../../hooks/useCashu";

interface BalanceProps {
}

const MintView: React.FC<BalanceProps> = ({ }) => {
  const [unit, setUnit] = useState<CurrencyUnit>("sats");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const { mintUrl, setMintUrl, getMintInfo, mintInfo, setMintInfo } = useCashu()

  useEffect(() => {

    const getInfoMint = async () => {

      if (!mintUrl) return;
      await getMintInfo(mintUrl)
    }

    getInfoMint()
  }, [mintUrl, setMintUrl])
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const changeUnit = (newUnit: CurrencyUnit) => {
    setUnit(newUnit);
    setIsDropdownOpen(false);
  };

  const handleChangeMintUrl = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMintUrl(value);

  };

  return (
    <div className="card p-4 mb-6 relative">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-text-secondary">
          Mint url
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        {mintUrl}
        <ChevronDownIcon className="w-5 h-5 text-text-secondary" />
      </div>
      {isDropdownOpen ? (
        <div
         className="absolute top-full left-0 mt-2 w-full bg-card-background rounded-md shadow-lg z-10 py-1"
        >
          <input
            className="bg-black text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
            // className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
            onChange={handleChangeMintUrl}
            placeholder="Mint url"
            type="text"
            value={mintUrl}
          >
          </input>

          <div className="p-3">
            {mintInfo &&
              <div>
                <p
                  className="overflow-auto max-h-64 whitespace-pre-wrap break-words">Name: {mintInfo?.name}</p>
                <p
                  className="overflow-auto max-h-64 whitespace-pre-wrap break-words">Pubkey: {mintInfo?.pubkey}</p>
                <p className="overflow-auto max-h-64 whitespace-pre-wrap break-words">Description: {mintInfo?.description}</p>
              </div>
            }
          </div>

        </div>
      ) : null}
    </div>
  );
};

export default MintView;
