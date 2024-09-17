import React from "react";
import {
  BellIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface HeaderProps {
  userHandle: string;
  avatarUrl: string;
  onNotificationClick: () => void;
  onSettingsClick: () => void;
  onSearchClick: () => void;
  unreadNotificationsCount: number;
}

const Header: React.FC<HeaderProps> = ({
  userHandle,
  avatarUrl,
  onNotificationClick,
  onSettingsClick,
  onSearchClick,
  unreadNotificationsCount,
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
          className="p-2 bg-card-background rounded-full transition-colors duration-200 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-accent"
          onClick={onSearchClick}
        >
          <MagnifyingGlassIcon className="w-6 h-6 text-text-secondary" />
        </button>
        <button
          className="p-2 bg-card-background rounded-full transition-colors duration-200 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-accent relative"
          onClick={onNotificationClick}
        >
          <BellIcon className="w-6 h-6 text-text-secondary" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadNotificationsCount}
            </span>
          )}
        </button>
        <button
          className="p-2 bg-card-background rounded-full transition-colors duration-200 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-accent"
          onClick={onSettingsClick}
        >
          <Cog6ToothIcon className="w-6 h-6 text-text-secondary" />
        </button>
      </div>
    </div>
  );
};

export default Header;
