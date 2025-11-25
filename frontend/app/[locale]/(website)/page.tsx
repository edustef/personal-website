import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { homeQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { getCanonicalUrl } from "@/lib/seo";

import {
  HeroIntro,
  HeroIntroContent,
  HeroIntroCtaButtons,
  HeroIntroSocialLinks,
} from "@/components/hero-intro";
import { HeroSpline } from "@/components/hero-spline";
import { ContactForm } from "@/components/contact-form";
import { toPlainText } from "next-sanity";
import ResolvedLink from "@/components/sanity/resolved-link";
import { HighlightBadge } from "@/components/ui/highlight-badge";
import CustomPortableText from "@/components/sanity/portable-text";
import { Button } from "@/components/ui/button";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import {
  localizeBlockContent,
  localizedImage,
  localizeField,
} from "@/sanity/lib/localization";
import { AnimatedContainer } from "@/components/ui/animated-container";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;

  const [{ data: home }] = await Promise.all([
    sanityFetch({ query: homeQuery, params: { locale }, stega: false }),
  ]);
  if (!home) {
    return notFound();
  }

  const pageTitle = localizeField(home.seo?.title, locale);
  const pageDescription = localizeBlockContent(home.seo?.description, locale);
  const canonicalUrl = getCanonicalUrl(locale, "/");

  return {
    title: pageTitle,
    description: toPlainText(pageDescription),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale,
      title: pageTitle,
      description: toPlainText(pageDescription),
      images: resolveOpenGraphImage(localizedImage(home.seo?.ogImage, locale)),
    },
    twitter: {
      card: home.seo?.ogImage ? "summary_large_image" : "summary",
      title: pageTitle,
      description: toPlainText(pageDescription),
      images: resolveOpenGraphImage(localizedImage(home.seo?.ogImage, locale)),
    },
  };
}

export default async function Page(props: Props) {
  const params = await props.params;
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const [{ data: home }] = await Promise.all([
    sanityFetch({ query: homeQuery, params: { locale } }),
  ]);

  if (!home) {
    notFound();
  }

  const profile = home.profile;

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col px-4 pt-12 pb-12 md:pt-24">
        <HeroSpline />
        {home && (
          <HeroIntro>
            <HeroIntroContent>
              <HighlightBadge>
                <span>
                  {localizeField(home.renovationLabelPrimary, locale)}
                </span>
                <span className="ml-1.5 font-bold">
                  {localizeField(home.renovationLabelSecondary, locale)}
                </span>
              </HighlightBadge>
              <h1 className="text-foreground max-w-3xl text-4xl leading-normal font-semibold text-pretty md:text-6xl md:leading-tight">
                {localizeField(home.headline, locale)}
              </h1>
              <CustomPortableText
                value={localizeBlockContent(home.tagline, locale)}
                className="text-muted-foreground text-lg md:text-xl"
              />
              <HeroIntroCtaButtons>
                {home.ctaButtons?.map(({ link, text, _key }) => (
                  <ResolvedLink
                    variant="default"
                    lang={locale}
                    key={_key}
                    link={link}
                  >
                    {localizeField(text, locale)}
                  </ResolvedLink>
                ))}
              </HeroIntroCtaButtons>
            </HeroIntroContent>

            <div className="flex flex-col gap-4">
              <AnimatedContainer>
                <h2 className="text-foreground text-lg font-semibold">
                  {localizeField(home.findMeOnLabel, locale)}
                </h2>
              </AnimatedContainer>
              <HeroIntroSocialLinks>
                {profile.socialLinks?.map(({ url, name }) => (
                  <Button key={url} asChild variant="outline">
                    <a href={url}>{name}</a>
                  </Button>
                ))}
              </HeroIntroSocialLinks>
            </div>
          </HeroIntro>
        )}
      </div>
      {profile?.email && (
        <section
          id="contact"
          className="bg-background mt-16 px-4 py-24 md:mt-24"
        >
          <div className="mx-auto flex w-full max-w-6xl justify-center">
            <div className="w-full max-w-lg">
              <ContactForm recipientEmail={profile.email} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
