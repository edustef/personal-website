import { cn } from "@/lib/utils";
import NextLink from "next/link";
import { buttonVariants } from "./button";
import { VariantProps } from "class-variance-authority";

type LinkProps = React.ComponentProps<typeof NextLink> &
  VariantProps<typeof buttonVariants>;

export function Link({ className, variant, size, ...props }: LinkProps) {
  return (
    <NextLink
      className={cn(buttonVariants({ variant: "link", size, className }))}
      {...props}
    />
  );
}
