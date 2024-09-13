// src/app/components/receive-view.tsx
import React from "react";

const ReceiveView: React.FC = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Receive Sats</h2>
      <div className="w-48 h-48 bg-white mx-auto mb-4" />
      <p className="text-center text-gray-300">
        Scan this QR code to receive sats
      </p>
    </div>
  );
};

export default ReceiveView;
