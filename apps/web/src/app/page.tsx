// src/app/page.tsx
"use client";

import Wallet from "./components/wallet";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Wallet />
    </div>
  );
}
