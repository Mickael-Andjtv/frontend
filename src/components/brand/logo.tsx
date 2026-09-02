import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "full" | "icon";
  className?: string;
  textClassName?: string;
};

export function Logo({ variant = "full", className, textClassName }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <UtensilsCrossed className="size-5" />
      </span>
      {variant === "full" && (
        <span className={cn("text-lg font-bold tracking-tight", textClassName)}>
          La Table d&apos;Or
        </span>
      )}
    </span>
  );
}