import { createContext, useContext, useState, ReactNode } from 'react';

// Define the Toast type
interface Toast {
  id: number;
  title: string;
  description?:string;
  type?: TypeToast | string
}
export enum TypeToast {
  "success",
  "error", "warning"

}
// Define the context type
interface ToastContextType {
  addToast: (props:AddToast) => void;
  removeToast: (id: number) => void;
  toasts: Toast[];
}

interface AddToast {
  title: string, type: string | TypeToast, description?:string
}
// Create the Toast context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = ({title, type}:AddToast) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, title, type }]);
    // Remove the toast automatically after 3 seconds
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};

// Create a custom hook to use the Toast context
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
