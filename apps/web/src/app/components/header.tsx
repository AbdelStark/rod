import React from "react";
import { BellIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  userHandle: string;
  avatarUrl: string;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userHandle,
  avatarUrl,
  onNotificationClick,
  onSettingsClick,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <img
          alt="User avatar"
          className="w-10 h-10 rounded-full mr-3"
          src={avatarUrl}
        />
        <div>
          <h1 className="text-xl font-semibold text-text-primary">
            Gm {userHandle}!
          </h1>
          <p className="text-sm text-text-secondary">Let's go nuts!</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          className="p-2 bg-card-background rounded-full transition-colors duration-200 hover:bg-opacity-80"
          onClick={onNotificationClick}
        >
          <BellIcon className="w-6 h-6 text-text-secondary" />
        </button>
        <button
          className="p-2 bg-card-background rounded-full transition-colors duration-200 hover:bg-opacity-80"
          onClick={onSettingsClick}
        >
          <Cog6ToothIcon className="w-6 h-6 text-text-secondary" />
        </button>
      </div>
    </div>
  );
};

export default Header;
