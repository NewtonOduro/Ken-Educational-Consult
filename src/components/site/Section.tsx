import type { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  inverted = false,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  inverted?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "")}>
      <p className={cn("eyebrow", inverted && "text-gold")}>
        <span className="gold-rule w-6" /> {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-4 text-3xl font-bold sm:text-4xl lg:text-[2.75rem]",
          inverted && "text-navy-foreground",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "text-muted-foreground mt-4 text-base leading-relaxed",
            inverted && "text-navy-foreground/75",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", className)}
    >
      {children}
    </div>
  );
}
