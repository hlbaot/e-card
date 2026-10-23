"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { CheckCircle2 } from "lucide-react";
const ToastContext = createContext<(message: string) => void>(() => {});
const ToastMessageContext = createContext("");
export const useToast = () => useContext(ToastContext);
export function ToastViewport() {
  const message = useContext(ToastMessageContext);
  return (
    <div
      role="status"
      aria-live="polite"
      className={message ? "toast" : "sr-only"}
    >
      {message && (
        <>
          <CheckCircle2 size={19} />
          {message}
        </>
      )}
    </div>
  );
}
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useCallback((value: string) => {
    setMessage(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 3500);
  }, []);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <ToastContext.Provider value={toast}>
      <ToastMessageContext.Provider value={message}>
        {children}
        <ToastViewport />
      </ToastMessageContext.Provider>
    </ToastContext.Provider>
  );
}
