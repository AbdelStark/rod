import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  userHandle: string;
  avatarUrl: string;
}

const Header: React.FC<HeaderProps> = ({ userHandle, avatarUrl }) => {
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
      <button className="p-2 bg-card-background rounded-full">
        <BellIcon className="w-6 h-6 text-text-primary" />
      </button>
    </div>
  );
};

export default Header;
