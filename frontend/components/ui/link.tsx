import { cn } from "@/lib/utils";
import { Link as NextLink } from "@/i18n/navigation";
import { buttonVariants } from "./button";
import { VariantProps } from "class-variance-authority";

export type LinkProps = React.ComponentProps<typeof NextLink> &
  VariantProps<typeof buttonVariants>;

export function Link({
  className,
  variant = "link",
  size,
  ...props
}: LinkProps) {
  return (
    <NextLink
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
