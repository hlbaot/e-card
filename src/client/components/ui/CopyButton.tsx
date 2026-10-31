"use client";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useToast } from "./Toast";

export function CopyButton({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  const toast = useToast();
  const tCommon = useTranslations("common");
  const tToast = useTranslations("toast");
  const buttonLabel = label ?? tCommon("copyLink");

  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          toast(tToast("linkCopied"));
        } catch {
          toast(tToast("copyFailed"), "error");
        }
      }}
    >
      <Copy size={16} />
      {buttonLabel}
    </button>
  );
}
