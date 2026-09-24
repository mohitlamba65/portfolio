import React from "react";
import { cn } from "@/lib/utils";

export function AdminCard({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("glass-card rounded-xl p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function AdminField({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("admin-field", className)}>
      <AdminLabel>{label}</AdminLabel>
      {children}
      {hint ? <AdminHint>{hint}</AdminHint> : null}
    </div>
  );
}

export function AdminFormSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("admin-form-section", className)}>
      <h4 className="admin-form-section-title">{title}</h4>
      {children}
    </section>
  );
}

export function AdminSectionHead({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="admin-section-head">
      <div>
        <h3 className="text-base font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h3>
        {description ? (
          <p className="admin-hint mt-1 normal-case tracking-normal">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function AdminLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label className={cn("admin-label", className)} {...props}>
      {children}
    </label>
  );
}

export function AdminInput({
  className,
  mono = false,
  ...props
}: React.ComponentProps<"input"> & { mono?: boolean }) {
  return (
    <input
      className={cn("admin-input", mono && "font-[family-name:var(--mono)]", className)}
      {...props}
    />
  );
}

export function AdminSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select className={cn("admin-input admin-select", className)} {...props}>
      {children}
    </select>
  );
}

export function AdminTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return <textarea className={cn("admin-textarea", className)} {...props} />;
}

export function AdminHint({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("admin-hint", className)} {...props}>
      {children}
    </p>
  );
}

export function AdminBadge({
  className,
  children,
  pulse = false,
  ...props
}: React.ComponentProps<"span"> & { pulse?: boolean }) {
  return (
    <span className={cn("admin-badge", className)} {...props}>
      {pulse ? (
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] animate-pulse" />
      ) : null}
      {children}
    </span>
  );
}

export function AdminListLayout({
  list,
  form,
  className,
}: {
  list: React.ReactNode;
  form: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("admin-list-layout", className)}>
      {list}
      {form}
    </div>
  );
}

export function AdminListPanel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("admin-list-panel", className)}>
      <div className="admin-list-panel-header">
        <span className="text-sm font-medium">{title}</span>
        {action}
      </div>
      <div className="admin-list-items">{children}</div>
    </div>
  );
}

export function AdminListItem({
  active,
  title,
  meta,
  onClick,
}: {
  active?: boolean;
  title: string;
  meta?: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={cn("admin-list-item", active && "active")}>
      <span className="admin-list-item-title">{title || "Untitled"}</span>
      {meta ? <span className="admin-list-item-meta">{meta}</span> : null}
    </button>
  );
}

export function AdminFormSurface({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("admin-form-surface", className)} {...props}>
      {children}
    </div>
  );
}

export function AdminDetails({
  summary,
  children,
  className,
}: {
  summary: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <details className={cn("admin-details", className)}>
      <summary>{summary}</summary>
      <div className="admin-details-body">{children}</div>
    </details>
  );
}

export function AdminUploadStatus({ message }: { message: string }) {
  const isSuccess = message.toLowerCase().includes("success");
  return (
    <div className={cn("admin-status-msg", isSuccess ? "success" : "info")}>
      {message}
    </div>
  );
}

export function AdminMediaPreview({
  src,
  alt,
  fallback,
  rounded = "full",
  size = "md",
}: {
  src?: string;
  alt: string;
  fallback: React.ReactNode;
  rounded?: "full" | "lg";
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm" ? "w-20 h-20" : size === "lg" ? "w-36 h-36" : "w-28 h-28";
  const roundClass = rounded === "full" ? "rounded-full" : "rounded-xl";
  return (
    <div className={cn("admin-preview-well flex items-center justify-center p-6")}>
      <div
        className={cn(
          sizeClass,
          roundClass,
          "overflow-hidden border-2 flex items-center justify-center bg-[var(--bg-elevated)]"
        )}
        style={{ borderColor: "color-mix(in srgb, var(--cyan) 40%, var(--line))" }}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          fallback
        )}
      </div>
    </div>
  );
}
