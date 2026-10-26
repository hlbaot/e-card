"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export type ToastVariant = "success" | "error";
type ToastFn = (message: string, variant?: ToastVariant) => void;

const ToastContext = createContext<ToastFn>(() => {});
const ToastMessageContext = createContext<{ message: string; variant: ToastVariant }>({
  message: "",
  variant: "success",
});
export const useToast = () => useContext(ToastContext);

function inferToastVariant(message: string, explicit?: ToastVariant): ToastVariant {
  if (explicit) return explicit;
  return /^(không thể|chưa thể|lỗi|vui lòng|chọn ảnh|đã có lỗi|yêu cầu thất bại)/i.test(
    message.trim(),
  )
    ? "error"
    : "success";
}

export function ToastViewport() {
  const { message, variant } = useContext(ToastMessageContext);
  const isError = variant === "error";
  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={message ? `toast ${isError ? "toast-error" : "toast-success"}` : "sr-only"}
    >
      {message && (
        <>
          {isError ? <AlertCircle size={19} /> : <CheckCircle2 size={19} />}
          <span>{message}</span>
        </>
      )}
    </div>
  );
}
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ message: string; variant: ToastVariant }>({
    message: "",
    variant: "success",
  });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useCallback((value: string, variant?: ToastVariant) => {
    setState({ message: value, variant: inferToastVariant(value, variant) });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState((prev) => ({ ...prev, message: "" })), 3500);
  }, []);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <ToastContext.Provider value={toast}>
      <ToastMessageContext.Provider value={state}>
        {children}
        <ToastViewport />
      </ToastMessageContext.Provider>
    </ToastContext.Provider>
  );
}
