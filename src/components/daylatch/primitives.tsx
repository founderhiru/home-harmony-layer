import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("border-t border-border/70 py-20 md:py-28", className)}>
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="font-display mt-4 text-3xl leading-[1.1] font-semibold tracking-tight text-balance md:text-[2.75rem]">
        {title}
      </h2>
      {body ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{body}</p>
      ) : null}
    </div>
  );
}

type Tone = "attention" | "waiting" | "handled" | "neutral";

const toneMap: Record<Tone, { dot: string; chip: string }> = {
  attention: { dot: "bg-attention", chip: "bg-attention-soft text-attention" },
  waiting: { dot: "bg-waiting", chip: "bg-waiting-soft text-waiting" },
  handled: { dot: "bg-handled", chip: "bg-handled-soft text-handled" },
  neutral: { dot: "bg-muted-foreground", chip: "bg-muted text-muted-foreground" },
};

export function StatusDot({ tone }: { tone: Tone }) {
  return <span className={cn("size-1.5 shrink-0 rounded-full", toneMap[tone].dot)} />;
}

export function Chip({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        toneMap[tone].chip,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[9px] font-semibold text-secondary-foreground ring-1 ring-border",
        className,
      )}
    >
      {name.slice(0, 2)}
    </span>
  );
}

export function CtaButton({
  children,
  variant = "primary",
  href = "#capture",
  className,
}: {
  children: ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200",
        variant === "primary"
          ? "bg-primary text-primary-foreground shadow-card hover:-translate-y-px hover:bg-primary/92"
          : "border border-border bg-surface-raised text-foreground hover:border-foreground/25 hover:bg-secondary",
        className,
      )}
    >
      {children}
    </a>
  );
}
