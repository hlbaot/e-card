"use client";
import { useEffect, useRef, useId } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToastViewport } from "./Toast";

export function Modal({
  title,
  children,
  onClose,
  width,
}: {
  title: string;
  width?: number;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const tCommon = useTranslations("common");
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (trigger instanceof HTMLElement) trigger.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className="modal"
      style={width ? { width: `min(${width}px, calc(100vw - 30px))` } : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-header">
        <h2 id={titleId}>{title}</h2>
        <button
          type="button"
          className="icon-button"
          aria-label={tCommon("closeDialog")}
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
      <ToastViewport />
    </dialog>
  );
}
