"use client";

import { ReactNode, forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes, SelectHTMLAttributes, useId } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "glass" | "gradient";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = "", variant = "default", padding = "md", ...props }, ref) => {
    const variants = {
      default: "card-base",
      elevated: "card-base shadow-[var(--shadow-elevated)]",
      glass: "glass rounded-2xl",
      gradient: "card-base gradient-border-gold relative overflow-hidden",
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={`${variants[variant]} ${paddings[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export interface BadgeProps {
  children: ReactNode;
  variant?: "gold" | "crimson" | "emerald" | "muted" | "success" | "warning" | "danger";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = "gold", className = "", size = "md", ...props }, ref) => {
    const variants = {
      gold: "badge-gold",
      crimson: "badge-crimson",
      emerald: "badge-emerald",
      muted: "badge-muted",
      success: "badge-emerald",
      warning: "badge-gold",
      danger: "badge-crimson",
    };

    const sizes = {
      sm: "px-2.5 py-1 text-xs",
      md: "px-3 py-1.5 text-xs",
      lg: "px-4 py-2 text-sm",
    };

    return (
      <span
        ref={ref}
        className={`badge-base ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "gold-outline";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", variant = "primary", size = "md", loading = false, fullWidth = false, disabled, ...props }, ref) => {
    const variants = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      danger: "btn-danger",
      ghost: "btn-ghost",
      "gold-outline": "btn-secondary border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[#080808]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3 text-base gap-2.5",
      xl: "px-10 py-4 text-lg gap-3",
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={`btn-base ${variants[variant]} ${sizes[size]} flex items-center justify-center ${fullWidth ? "w-full" : ""} ${className}`}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || `input-${generatedId}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-[var(--color-cream)]">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`input-base ${leftIcon ? "pl-12" : ""} ${rightIcon ? "pr-12" : ""} ${error ? "border-[var(--color-crimson)]" : ""} ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : helperId}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-[var(--color-crimson-light)]" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-[var(--color-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || `textarea-${generatedId}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-2 block text-sm font-medium text-[var(--color-cream)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`input-base min-h-[100px] resize-y ${error ? "border-[var(--color-crimson)]" : ""} ${className}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : helperId}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-[var(--color-crimson-light)]" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-[var(--color-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
  required?: boolean;
}

export function Label({ children, htmlFor, className = "", required = false }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={`mb-1.5 block text-sm font-medium text-[var(--color-cream)] ${className}`}>
      {children}
      {required && <span className="ml-1 text-[var(--color-crimson)]" aria-hidden="true">*</span>}
    </label>
  );
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || `select-${generatedId}`;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-2 block text-sm font-medium text-[var(--color-cream)]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`input-base appearance-none pr-10 ${error ? "border-[var(--color-crimson)]" : ""} ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : helperId}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] pointer-events-none" />
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-[var(--color-crimson-light)]" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-[var(--color-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export interface PageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function PageShell({ title, subtitle, children, className = "", action }: PageShellProps) {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--color-cream)] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-[var(--color-muted)] text-base sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
}

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = "", variant = "text", width, height }: SkeletonProps) {
  const baseStyles = "animate-pulse bg-gradient-to-r from-[var(--color-bg-elevated)] via-[var(--color-bg-card)] to-[var(--color-bg-elevated)] bg-[length:200%_100%] animate-shimmer rounded";

  const variants = {
    text: "h-4",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <Card variant="default" padding="md" className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={16} />
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" height={120} />
      <div className="space-y-3">
        <Skeleton variant="rectangular" width="100%" height={56} />
        <Skeleton variant="rectangular" width="100%" height={56} />
        <Skeleton variant="rectangular" width="100%" height={56} />
      </div>
    </Card>
  );
}

export interface QuickBetChipsProps {
  amount: string;
  setAmount: (value: string) => void;
  balance: number;
  className?: string;
}

export function QuickBetChips({ amount, setAmount, balance, className = "" }: QuickBetChipsProps) {
  const chips = [50, 100, 250, 500, 1000, balance].filter((chip) => chip > 0 && chip <= balance);

  // Remove duplicates
  const uniqueChips = [...new Set(chips)].sort((a, b) => a - b);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {uniqueChips.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => setAmount(String(chip))}
          className={`btn-base ${Number(amount) === chip ? "btn-primary" : "btn-secondary"} text-sm`}
          aria-pressed={Number(amount) === chip}
        >
          {chip === balance ? "ALL IN" : chip.toLocaleString()}
        </button>
      ))}
    </div>
  );
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "danger";
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="w-full max-w-md card-base p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-dialog-title" className="font-display text-xl font-semibold text-[var(--color-cream)]">
          {title}
        </h3>
        <div className="mt-3 text-[var(--color-muted)] text-sm">
          {description}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function statusTone(
  status: string,
): "gold" | "crimson" | "emerald" | "muted" {
  switch (status) {
    case "OPEN":
      return "emerald";
    case "PENDING":
      return "gold";
    case "LOCKED":
      return "muted";
    case "RESOLVED":
      return "emerald";
    case "REJECTED":
    case "VOID":
      return "crimson";
    default:
      return "muted";
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function formatCurrency(num: number): string {
  return `${formatNumber(num)} pts`;
}