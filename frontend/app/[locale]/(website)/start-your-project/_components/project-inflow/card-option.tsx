import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type CardOptionProps = {
  title: string;
  description?: string;
  selected: boolean;
  onChange: () => void;
  name: string;
  value: string;
  id: string;
  multi?: boolean;
  compact?: boolean;
  size?: "sm" | "md";
};

export function CardOption({
  title,
  description,
  selected,
  onChange,
  name,
  value,
  id,
  multi = false,
  compact = false,
  size = "md",
}: CardOptionProps) {
  const inputType = multi ? "checkbox" : "radio";

  return (
    <label
      htmlFor={id}
      className={cn(
        "hover:border-primary/50 cursor-pointer rounded-lg border-2 transition-all block focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        selected ? "border-primary bg-primary/5" : "border-muted bg-card",
        size === "sm" ? "p-3" : "p-4",
        compact ? "py-3" : ""
      )}
    >
      <input
        type={inputType}
        name={name}
        value={value}
        id={id}
        checked={selected}
        onChange={onChange}
        className="sr-only"
        aria-label={description ? `${title}, ${description}` : title}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <h3
            className={cn(
              "leading-none font-medium text-balance",
              size === "sm" || compact ? "text-sm" : ""
            )}
          >
            {title}
          </h3>
          {description && (
            <p
              className={cn(
                "text-muted-foreground text-pretty",
                size === "sm" ? "text-xs" : "text-sm"
              )}
            >
              {description}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex shrink-0 items-center justify-center border pointer-events-none",
            size === "sm" ? "h-4 w-4" : "h-5 w-5",
            multi ? "rounded-xs" : "rounded-full",
            selected
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground"
          )}
          aria-hidden="true"
        >
          {selected &&
            (multi ? (
              <Check className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} />
            ) : (
              <div
                className={cn(
                  "bg-primary-foreground rounded-full",
                  size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2"
                )}
              />
            ))}
        </div>
      </div>
    </label>
  );
}
