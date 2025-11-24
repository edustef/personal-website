import { Link as UiLink, LinkProps as UiLinkProps } from "@/components/ui/link";

import { linkResolver, LinkResolverProps } from "@/sanity/lib/utils";

type ResolvedLinkProps = {
  link: LinkResolverProps;
} & Omit<UiLinkProps, "href">;

export default function ResolvedLink({
  link,
  children,
  ...props
}: ResolvedLinkProps) {
  const resolvedLink = linkResolver(link);

  if (typeof resolvedLink === "string") {
    return (
      <UiLink
        href={resolvedLink}
        target={link?.openInNewTab ? "_blank" : undefined}
        rel={link?.openInNewTab ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </UiLink>
    );
  }
  return <>{children}</>;
}
