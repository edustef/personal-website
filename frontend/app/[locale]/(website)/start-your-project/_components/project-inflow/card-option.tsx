import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CardOptionProps = {
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
  compact?: boolean;
  size?: "sm" | "md";
};

export function CardOption({
  title,
  description,
  selected,
  onClick,
  multi = false,
  compact = false,
  size = "md",
}: CardOptionProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "hover:border-primary/50 cursor-pointer rounded-lg border-2 transition-all",
        selected ? "border-primary bg-primary/5" : "border-muted bg-card",
        size === "sm" ? "p-3" : "p-4",
        compact ? "py-3" : "",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <h3
            className={cn(
              "leading-none font-medium",
              size === "sm" || compact ? "text-sm" : "",
            )}
          >
            {title}
          </h3>
          {description && (
            <p
              className={cn(
                "text-muted-foreground",
                size === "sm" ? "text-xs" : "text-sm",
              )}
            >
              {description}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded border",
            size === "sm" ? "h-4 w-4" : "h-5 w-5",
            multi ? "rounded-sm" : "rounded-full",
            selected
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground",
          )}
        >
          {selected &&
            (multi ? (
              <Check className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} />
            ) : (
              <div
                className={cn(
                  "bg-primary-foreground rounded-full",
                  size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
                )}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

