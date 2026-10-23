"use client";
import { Copy } from "lucide-react";
import { useToast } from "./Toast";
export function CopyButton({
  value,
  label = "Sao chép liên kết",
}: {
  value: string;
  label?: string;
}) {
  const toast = useToast();
  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          toast("Đã sao chép liên kết");
        } catch {
          toast("Không thể sao chép. Hãy chọn và sao chép liên kết.");
        }
      }}
    >
      <Copy size={16} />
      {label}
    </button>
  );
}
