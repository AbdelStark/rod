import { TypeToast, useToast } from "../../hooks/useToast";

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div
            className="fixed bottom-5 right-5 space-y-2 z-50"
        >
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${toast?.type == TypeToast.success ? "bg-green-500"
                        : TypeToast.error ? "bg-red-500" :
                            TypeToast.warning && "bg-blue-500"
                        } text-white p-3 rounded shadow-md`}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
