import { Suspense } from "react";
import { notFound } from "next/navigation";

import { AllPosts } from "@/components/Posts";
import HeroSection from "@/components/HeroSection";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProjectGrid from "@/components/ProjectGrid";
import SkillsSection from "@/components/SkillsSection";
import CertificatesSection from "@/components/CertificatesSection";
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
import Image from "next/image";
import underConstructionImage from "@/assets/images/under-construction.png";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  ConstructionIcon,
  ExternalLinkIcon,
  FileTextIcon,
  LinkedinIcon,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  params: Promise<{ locale: string }>;
};

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
    <div className="mx-auto mt-24 flex max-w-4xl flex-col items-start justify-center gap-8 px-3">
      <Card className="bg-secondary text-secondary-foreground relative w-full">
        <CardContent className="flex flex-row items-center gap-4">
          <ConstructionIcon className="size-24" />
          <div className="flex flex-col gap-4">
            <CardTitle className="text-3xl font-bold">
              Under Construction
            </CardTitle>
            <Button className="w-fit" variant="outline" asChild>
              <a
                href="/files/eduard-stefan-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Get my resume</span>
                <ExternalLinkIcon className="size-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex w-full flex-col items-start justify-between gap-24 md:flex-row">
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
              <Textarea />
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
