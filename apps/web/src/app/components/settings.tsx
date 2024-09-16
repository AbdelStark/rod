import React from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

const SettingsButton: React.FC = () => {
  const handleOpenSettings = () => {
    const event = new CustomEvent("openSettings");
    window.dispatchEvent(event);
  };

  return (
    <button
      className="absolute top-6 right-6 text-gray-400 hover:text-white transition duration-200"
      onClick={handleOpenSettings}
    >
      <Cog6ToothIcon className="h-8 w-8" />
    </button>
  );
};

export default SettingsButton;
