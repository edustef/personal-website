import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  homeQuery,
  allJobsQuery,
  allProjectsQuery,
  allSkillsQuery,
  allCertificatesQuery,
} from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { languages, localizeField, type LanguageId } from "@/lib/i18n";
import { HeroIntro } from "@/components/hero-intro";
import { HeroSpline } from "@/components/hero-spline";
import { getLocalizedSettingsMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const locale = params.locale as LanguageId;
  const [{ data: home }, localizedSettings] = await Promise.all([
    sanityFetch({ query: homeQuery, params: { locale }, stega: false }),
    getLocalizedSettingsMetadata(locale),
  ]);

  const pageTitle = localizeField(home?.title, locale);
  const pageDescription =
    localizeField(home?.tagline, locale) || localizedSettings.description;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      type: "website",
      locale,
      title: localizedSettings.title || "",
      description: localizedSettings.description || "",
      images: localizedSettings.ogImage
        ? [localizedSettings.ogImage]
        : undefined,
    },
    twitter: {
      card: localizedSettings.ogImage ? "summary_large_image" : "summary",
      title: localizedSettings.title || "",
      description: localizedSettings.description || "",
      images: localizedSettings.ogImage
        ? [localizedSettings.ogImage.url]
        : undefined,
    },
  };
}

export default async function Page(props: Props) {
  const params = await props.params;
  const locale = params.locale as LanguageId;

  if (!languages.find((lang) => lang.id === locale)) {
    notFound();
  }

  const [
    { data: home },
    { data: jobs },
    { data: projects },
    { data: skills },
    { data: certificates },
  ] = await Promise.all([
    sanityFetch({ query: homeQuery, params: { locale } }),
    sanityFetch({ query: allJobsQuery, params: { locale } }),
    sanityFetch({ query: allProjectsQuery, params: { locale } }),
    sanityFetch({ query: allSkillsQuery, params: { locale } }),
    sanityFetch({ query: allCertificatesQuery, params: { locale } }),
  ]);

  const featuredProjects =
    home?.featuredProjects && home.featuredProjects.length > 0
      ? home.featuredProjects
      : projects?.slice(0, 6);

  const profile = home?.profile;

  // return (
  //   <>
  //     <HeroSection
  //       headline={home?.headline}
  //       tagline={home?.tagline}
  //       profile={home?.profile}
  //       ctaButtons={home?.ctaButtons}
  //       locale={locale}
  //     />

  //     <ExperienceTimeline jobs={jobs || []} locale={locale} />

  //     <SkillsSection skills={skills || []} />

  //     <ProjectGrid projects={featuredProjects || []} locale={locale} />

  //     <CertificatesSection certificates={certificates || []} locale={locale} />

  //     <section className="bg-background py-24">
  //       <div className="container">
  //         <div className="mx-auto max-w-6xl">
  //           <div className="mb-16 text-center">
  //             <h2 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">
  //               Latest Posts
  //             </h2>
  //             <p className="text-muted-foreground text-xl">
  //               Thoughts, insights, and tutorials
  //             </p>
  //           </div>
  //           <Suspense
  //             fallback={
  //               <div className="text-muted-foreground text-center">
  //                 Loading posts...
  //               </div>
  //             }
  //           >
  //             {await AllPosts(locale)}
  //           </Suspense>
  //         </div>
  //       </div>
  //     </section>
  //   </>
  // );

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col px-4 pt-12 pb-12 md:pt-24">
        <HeroSpline />
        {home && (
          <HeroIntro
            headline={localizeField(home.headline, locale)}
            tagline={
              home.tagline ? localizeField(home.tagline, locale) : undefined
            }
            renovationLabelPrimary={
              home.renovationLabelPrimary
                ? localizeField(home.renovationLabelPrimary, locale)
                : undefined
            }
            renovationLabelSecondary={
              home.renovationLabelSecondary
                ? localizeField(home.renovationLabelSecondary, locale)
                : undefined
            }
            findMeOnLabel={
              home.findMeOnLabel
                ? localizeField(home.findMeOnLabel, locale)
                : undefined
            }
            resumeButtonLabel={
              home.resumeButtonLabel
                ? localizeField(home.resumeButtonLabel, locale)
                : undefined
            }
          />
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
