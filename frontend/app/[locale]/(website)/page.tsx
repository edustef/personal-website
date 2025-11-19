import { notFound } from "next/navigation";

import {
  homeQuery,
  allJobsQuery,
  allProjectsQuery,
  allSkillsQuery,
  allCertificatesQuery,
} from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import { languages, type LanguageId } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import { ConstructionIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardTitle } from "@/components/ui/card";

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
    <div className="mx-auto flex max-w-4xl flex-col items-start justify-center gap-8 px-4 pt-12 pb-12 md:pt-24">
      <div className="flex w-full flex-col items-start justify-between gap-16 md:flex-row">
        <form className="flex w-full flex-col gap-4 md:max-w-sm" action="">
          <h2 className="text-2xl font-bold">Contact me</h2>
          <FieldGroup>
            <Field>
              <FieldLabel>My email address</FieldLabel>
              <Input disabled value={profile?.email || ""} />
            </Field>
            <Field>
              <FieldLabel>Your email address</FieldLabel>
              <Input name="email" placeholder="Your email address" />
            </Field>
            <Field>
              <FieldLabel>Your message</FieldLabel>
              <Textarea placeholder="Your message..." />
            </Field>
            <Button type="submit">Send</Button>
          </FieldGroup>
        </form>
        <div className="flex w-full flex-col gap-4 md:max-w-sm">
          <h2 className="text-2xl font-bold">Find me on</h2>
          <div className="flex flex-col justify-center gap-2">
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
