import type { InputHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  id,
  className,
  ...props
}: InputProps) {
  return (
    <div className="field">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        className={cn(className)}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <span role="alert" className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}
