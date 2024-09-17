// utils/currencyUtils.ts

const SATS_PER_BTC = 100000000;
const BTC_TO_USD = 58000; // Hardcoded for now

export type CurrencyUnit = "sats" | "btc" | "usd";

export function getActualBtcPrice(): number {
  // TODO: Implement API call to get actual BTC price
  return BTC_TO_USD;
}

export function convertSatsToBtc(sats: number): number {
  return sats / SATS_PER_BTC;
}

export function convertSatsToUsd(sats: number): number {
  const btc = convertSatsToBtc(sats);
  return btc * getActualBtcPrice();
}

export function formatBalance(balance: number, unit: CurrencyUnit): string {
  switch (unit) {
    case "sats":
      return `${balance.toLocaleString()} sats`;
    case "btc":
      return `₿ ${convertSatsToBtc(balance).toFixed(8)}`;
    case "usd":
      return `$ ${convertSatsToUsd(balance).toFixed(2)}`;
  }
}
