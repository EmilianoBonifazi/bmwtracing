// frontend/src/hooks/use-toast.tsx

import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define the maximum number of toasts that can be displayed simultaneously
const TOAST_LIMIT = 5;

// Define the default duration (in milliseconds) after which a toast is auto-dismissed
const TOAST_DURATION = 5000;

// Define toast variants
export type ToastVariant = "default" | "success" | "error" | "info";

// Define the structure of a toast
export interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  action?: React.ReactNode;
  open?: boolean;
}

// Define action types
type Action =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "REMOVE_TOAST"; id: string }
  | { type: "DISMISS_TOAST"; id?: string };

// Define the state structure
interface State {
  toasts: Toast[];
}

// Create the initial state
const initialState: State = {
  toasts: [],
};

// Create the reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      const newToasts = [action.toast, ...state.toasts];
      return {
        toasts: newToasts.slice(0, TOAST_LIMIT),
      };
    case "REMOVE_TOAST":
      return {
        toasts: state.toasts.filter((toast) => toast.id !== action.id),
      };
    case "DISMISS_TOAST":
      if (action.id) {
        return {
          toasts: state.toasts.map((toast) =>
            toast.id === action.id ? { ...toast, open: false } : toast
          ),
        };
      } else {
        return {
          toasts: state.toasts.map((toast) => ({ ...toast, open: false })),
        };
      }
    default:
      return state;
  }
};

// Create the Toast Context
interface ToastContextProps {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id" | "open">) => { id: string; dismiss: () => void };
  dismiss: (id?: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// Create a unique ID generator
let count = 0;
const generateId = () => {
  count += 1;
  return count.toString();
};

// ToastProvider component
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Function to add a toast
  const toast = (toast: Omit<Toast, "id" | "open">) => {
    const id = generateId();
    const newToast: Toast = { id, open: true, ...toast };

    dispatch({ type: "ADD_TOAST", toast: newToast });

    // Set up auto-dismissal
    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", id });
    }, TOAST_DURATION);

    // Return the toast ID and dismiss function
    return {
      id,
      dismiss: () => dispatch({ type: "REMOVE_TOAST", id }),
    };
  };

  // Function to dismiss toasts
  const dismiss = (id?: string) => {
    if (id) {
      dispatch({ type: "REMOVE_TOAST", id });
    } else {
      state.toasts.forEach((toast) => {
        dispatch({ type: "REMOVE_TOAST", id: toast.id });
      });
    }
  };

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook to use the Toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
