// frontend/src/components/ToastContainer.tsx

import React from "react";
import { useToast, ToastVariant } from "@/hooks/use-toast";
import { Transition } from "@headlessui/react"; // For animations
import { X } from "lucide-react";

const variantStyles: Record<ToastVariant, string> = {
  default: "bg-gray-800 text-white",
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
};

export const ToastContainer = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col space-y-2">
      {toasts.map((toast) => (
        <Transition
          key={toast.id}
          show={toast.open !== false}
          enter="transform transition duration-300"
          enterFrom="translate-y-2 opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transform transition duration-300"
          leaveFrom="translate-y-0 opacity-100"
          leaveTo="translate-y-2 opacity-0"
        >
          <div
            className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 ${variantStyles[toast.variant || "default"]}`}
          >
            <div className="flex-1 w-0 p-4">
              {toast.title && (
                <p className="text-sm font-medium">{toast.title}</p>
              )}
              {toast.description && (
                <p className="mt-1 text-sm">{toast.description}</p>
              )}
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => dismiss(toast.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Transition>
      ))}
    </div>
  );
};
