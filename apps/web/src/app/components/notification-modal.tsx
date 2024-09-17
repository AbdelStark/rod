import React from "react";
import { Dialog } from "@headlessui/react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: number;
  message: string;
  date: Date;
  read: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
}) => {
  return (
    <Dialog className="relative z-50" onClose={onClose} open={isOpen}>
      <div aria-hidden="true" className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-card-background p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium mb-4">
            Notifications
          </Dialog.Title>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                className={`p-3 rounded-lg ${
                  notification.read ? "bg-gray-800" : "bg-gray-700"
                }`}
                key={notification.id}
              >
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(notification.date, { addSuffix: true })}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              className="bg-accent text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
              onClick={onMarkAsRead}
            >
              Mark all as read
            </button>
            <button
              className="bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-opacity-90 transition-colors duration-150"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default NotificationModal;
