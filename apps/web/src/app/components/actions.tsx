import React from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  QrCodeIcon,
  GiftIcon,
} from "@heroicons/react/24/solid";

interface ActionsProps {
  onSend: () => void;
  onReceive: () => void;
  onScan: () => void;
  onGift: () => void;
}

const Actions: React.FC<ActionsProps> = ({
  onSend,
  onReceive,
  onScan,
  onGift,
}) => {
  const ActionButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }> = ({ icon, label, onClick }) => (
    <button className="action-button" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex justify-between mb-8">
      <ActionButton icon={<ArrowUpIcon />} label="Send" onClick={onSend} />
      <ActionButton
        icon={<ArrowDownIcon />}
        label="Receive"
        onClick={onReceive}
      />
      <ActionButton icon={<QrCodeIcon />} label="Scan" onClick={onScan} />
      <ActionButton icon={<GiftIcon />} label="Gift" onClick={onGift} />
    </div>
  );
};

export default Actions;
