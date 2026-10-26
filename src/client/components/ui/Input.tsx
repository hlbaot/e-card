import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  id: explicitId,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const id = explicitId || generatedId;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [props["aria-describedby"], errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="field">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        className={cn(className)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      />
      {error && (
        <span id={errorId} role="alert" className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}
