import { notFound } from "next/navigation";

import {
  homeQuery,
  allJobsQuery,
  allProjectsQuery,
  allSkillsQuery,
  allCertificatesQuery,
} from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { languages, localizeField, type LanguageId } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/ContactForm";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const locale = params.locale as LanguageId;

  return {
    title: "Home",
    description: "Home",
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
    <div className="flex flex-col items-start justify-center gap-8 pt-12 px-4 pb-12 md:pt-24">
      {home && (
        <section className="mx-auto w-full max-w-6xl">
          <h1 className="text-foreground max-w-2xl text-4xl leading-tight font-semibold md:text-5xl">
            {localizeField(home.headline, locale)}
          </h1>
        </section>
      )}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-start justify-between gap-16 md:flex-row">
        {profile?.email && <ContactForm recipientEmail={profile.email} />}
        <div className="flex w-full flex-col gap-4 md:max-w-sm">
          <h2 className="text-2xl font-bold">Find me on</h2>
          <div className="flex flex-col justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="https://www.linkedin.com/in/eduard-stefan-089371100/">
                LinkedIn
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://github.com/edustef">GitHub</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://www.instagram.com/eduardstefan/">
                Instagram
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
