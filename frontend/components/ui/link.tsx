import { cn } from "@/lib/utils";
import { Link as NextLink } from "@/i18n/navigation";
import { buttonVariants } from "./button";
import { VariantProps } from "class-variance-authority";

export type LinkProps = Omit<React.ComponentProps<typeof NextLink>, "href"> &
  VariantProps<typeof buttonVariants> & {
    href: string;
  };

export function Link({
  className,
  href,
  variant = "link",
  size,
  ...props
}: LinkProps) {
  return (
    <NextLink
      // @ts-expect-error - TODO: Fix this nextjs issue with locale prefixing
      href={href}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
