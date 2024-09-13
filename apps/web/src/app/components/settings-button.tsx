// apps/web/src/app/components/settings-button.tsx
"use client";

import React from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

const SettingsButton: React.FC = () => {
  const handleOpenSettings = () => {
    const event = new CustomEvent("openSettings");
    window.dispatchEvent(event);
  };

  return (
    <button
      className="absolute top-4 right-4 text-white hover:text-gray-300 transition duration-200"
      onClick={handleOpenSettings}
    >
      <Cog6ToothIcon className="h-6 w-6" />
    </button>
  );
};

export default SettingsButton;
