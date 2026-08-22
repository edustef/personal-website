import publishedEditorialWorkflow from "@/assets/images/sanity/published-editorial-workflow.png";
import { SanityArtifactMotion } from "@/components/sections/sanity-artifact-motion";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

function ContentModelArtifact() {
  return (
    <div
      data-sanity-artifact-layer
      className="absolute top-[2%] left-[2%] h-[66%] w-[68%] -rotate-[1.5deg] border border-[#b99c8d]/30 bg-[#34251f] shadow-[0_22px_55px_rgba(8,6,5,.4)]"
    >
      <div className="flex h-8 items-center justify-between border-[#cbb2a4]/18 border-b px-3 font-mono text-[0.43rem] uppercase tracking-[0.14em] text-[#d5c4ba]/64 sm:h-10 sm:px-4 sm:text-[0.5rem]">
        <span>Content model</span>
        <span>Schema map</span>
      </div>
      <div className="relative h-[calc(100%-2rem)] overflow-hidden p-3 sm:h-[calc(100%-2.5rem)] sm:p-4">
        <div className="absolute top-[19%] left-[12%] w-[31%] border border-[#d6c3b8]/30 bg-[#2a1e1a] p-2 font-mono text-[0.42rem] text-[#eaded6]/74 sm:p-3 sm:text-[0.48rem]">
          <p className="text-[#f2e6de]">Page</p>
          <p className="mt-2 border-[#d6c3b8]/16 border-t pt-1.5">title</p>
          <p className="mt-1">slug</p>
          <p className="mt-1">blocks [ ]</p>
          <p className="mt-1">locale</p>
        </div>
        <div className="absolute top-[10%] right-[8%] w-[34%] border border-[#d6c3b8]/30 bg-[#2a1e1a] p-2 font-mono text-[0.42rem] text-[#eaded6]/74 sm:p-3 sm:text-[0.48rem]">
          <p className="text-[#f2e6de]">Reusable block</p>
          <p className="mt-2 border-[#d6c3b8]/16 border-t pt-1.5">heading</p>
          <p className="mt-1">content</p>
          <p className="mt-1">media ref</p>
        </div>
        <div className="absolute right-[12%] bottom-[10%] w-[30%] border border-[#d6c3b8]/30 bg-[#2a1e1a] p-2 font-mono text-[0.42rem] text-[#eaded6]/74 sm:p-3 sm:text-[0.48rem]">
          <p className="text-[#f2e6de]">Author</p>
          <p className="mt-2 border-[#d6c3b8]/16 border-t pt-1.5">name</p>
          <p className="mt-1">bio</p>
          <p className="mt-1">image</p>
        </div>
        <span className="absolute top-[32%] left-[43%] h-px w-[18%] bg-[#d6c3b8]/28" />
        <span className="absolute top-[32%] left-[60%] h-[18%] w-px bg-[#d6c3b8]/28" />
        <span className="absolute top-[50%] left-[59%] h-px w-[10%] bg-[#d6c3b8]/28" />
        <span className="absolute bottom-[20%] left-[29%] h-[19%] w-px bg-[#d6c3b8]/28" />
        <span className="absolute right-[38%] bottom-[20%] h-px w-[33%] bg-[#d6c3b8]/28" />
      </div>
    </div>
  );
}

function StudioArtifact() {
  return (
    <div
      data-sanity-artifact-layer
      className="absolute top-[15%] right-[1%] h-[63%] w-[69%] rotate-[0.7deg] overflow-hidden border border-[#d3c1b6]/32 bg-[#171719] shadow-[0_28px_70px_rgba(6,5,4,.56)]"
    >
      <div className="flex h-8 items-center border-[#f1e8e1]/16 border-b bg-[#202023] font-mono text-[0.4rem] text-[#eee8e4]/62 sm:h-10 sm:text-[0.47rem]">
        <div className="flex h-full w-[4.25rem] shrink-0 items-center gap-1.5 border-[#f1e8e1]/14 border-r px-2 sm:w-[5.75rem] sm:px-3">
          <span className="flex size-3 -rotate-6 items-center justify-center bg-[#f36458] font-sans text-[0.38rem] font-bold text-[#171719] sm:size-3.5 sm:text-[0.42rem]">
            S
          </span>
          <span className="text-[#f5efeb]">Sanity</span>
        </div>
        <div className="flex h-full min-w-0 flex-1 items-end gap-2 px-2 sm:gap-3 sm:px-3">
          <span className="flex h-full items-center border-[#f36458] border-b text-[#f5efeb]">
            Structure
          </span>
          <span className="hidden h-full items-center sm:flex">
            Presentation
          </span>
        </div>
        <div className="mr-2 flex size-4 shrink-0 items-center justify-center border border-[#f1e8e1]/18 text-[0.36rem] text-[#f5efeb] sm:mr-3 sm:size-5 sm:text-[0.42rem]">
          ES
        </div>
      </div>

      <div className="grid h-[calc(100%-2rem)] grid-cols-[4.25rem_4.85rem_1fr] sm:h-[calc(100%-2.5rem)] sm:grid-cols-[5.75rem_7.5rem_1fr]">
        <div className="min-w-0 border-[#f1e8e1]/14 border-r bg-[#1c1c1f] font-mono text-[0.36rem] text-[#eee8e4]/52 sm:text-[0.43rem]">
          <div className="flex h-6 items-center justify-between border-[#f1e8e1]/12 border-b px-1.5 text-[#f5efeb] sm:h-8 sm:px-2.5">
            <span>Content</span>
            <span className="text-[#eee8e4]/35">•••</span>
          </div>
          <div className="p-1 sm:p-1.5">
            <p className="flex items-center justify-between bg-[#f1e8e1]/9 px-1.5 py-1 text-[#f5efeb] sm:px-2 sm:py-1.5">
              <span>Pages</span>
              <span>›</span>
            </p>
            <p className="flex items-center justify-between px-1.5 py-1 sm:px-2 sm:py-1.5">
              <span>Articles</span>
              <span>›</span>
            </p>
            <p className="flex items-center justify-between px-1.5 py-1 sm:px-2 sm:py-1.5">
              <span>Authors</span>
              <span>›</span>
            </p>
            <p className="flex items-center justify-between px-1.5 py-1 sm:px-2 sm:py-1.5">
              <span>Navigation</span>
              <span>›</span>
            </p>
          </div>
        </div>

        <div className="min-w-0 border-[#f1e8e1]/14 border-r bg-[#202023] font-mono text-[0.34rem] text-[#eee8e4]/48 sm:text-[0.41rem]">
          <div className="flex h-6 items-center justify-between border-[#f1e8e1]/12 border-b px-1.5 text-[#f5efeb] sm:h-8 sm:px-2.5">
            <span>Pages</span>
            <span className="text-[0.52rem] text-[#eee8e4]/60 sm:text-[0.64rem]">
              +
            </span>
          </div>
          <div className="p-1 sm:p-1.5">
            <div className="border border-[#f36458]/45 bg-[#f36458]/8 p-1.5 text-[#f5efeb] transition-colors duration-300 group-hover/artifacts:border-[#f36458]/70 group-hover/artifacts:bg-[#f36458]/12 sm:p-2">
              <p className="truncate font-sans text-[0.4rem] leading-tight sm:text-[0.48rem]">
                Thoughtful systems
              </p>
              <p className="mt-1 text-[#eee8e4]/38">Page</p>
            </div>
            <div className="mt-1.5 p-1.5 sm:p-2">
              <p className="truncate font-sans text-[0.4rem] leading-tight text-[#eee8e4]/70 sm:text-[0.48rem]">
                Services
              </p>
              <p className="mt-1 text-[#eee8e4]/32">Page</p>
            </div>
            <div className="p-1.5 sm:p-2">
              <p className="truncate font-sans text-[0.4rem] leading-tight text-[#eee8e4]/70 sm:text-[0.48rem]">
                About
              </p>
              <p className="mt-1 text-[#eee8e4]/32">Page</p>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col bg-[#18181a]">
          <div className="flex h-6 items-center justify-between border-[#f1e8e1]/12 border-b px-2 font-mono text-[0.34rem] text-[#eee8e4]/48 sm:h-8 sm:px-3 sm:text-[0.41rem]">
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <span className="text-[#f5efeb]">Page</span>
              <span className="text-[#8eb88c]">Published</span>
            </div>
            <span>•••</span>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden p-2 sm:p-3">
            <div className="flex items-center gap-2 border-[#f1e8e1]/12 border-b pb-1.5 font-mono text-[0.32rem] text-[#eee8e4]/42 sm:gap-3 sm:pb-2 sm:text-[0.39rem]">
              <span className="border-[#f36458] border-b pb-1 text-[#f5efeb]">
                Form
              </span>
              <span>Preview</span>
              <span className="ml-auto">EN</span>
            </div>
            <div className="mt-2 sm:mt-3">
              <p className="font-mono text-[0.31rem] text-[#eee8e4]/42 sm:text-[0.38rem]">
                Title
              </p>
              <div className="mt-1 border border-[#f1e8e1]/18 bg-[#212124] px-1.5 py-1 text-[0.4rem] leading-tight text-[#f5efeb] sm:px-2 sm:py-1.5 sm:text-[0.5rem]">
                Thoughtful systems for digital publishing
              </div>
            </div>
            <div className="mt-1.5 sm:mt-2.5">
              <p className="font-mono text-[0.31rem] text-[#eee8e4]/42 sm:text-[0.38rem]">
                Slug
              </p>
              <div className="mt-1 truncate border border-[#f1e8e1]/18 bg-[#212124] px-1.5 py-1 font-mono text-[0.31rem] text-[#eee8e4]/55 sm:px-2 sm:py-1.5 sm:text-[0.38rem]">
                thoughtful-systems
              </div>
            </div>
            <div className="mt-1.5 sm:mt-2.5">
              <p className="font-mono text-[0.31rem] text-[#eee8e4]/42 sm:text-[0.38rem]">
                Page builder
              </p>
              <div className="mt-1 flex items-center justify-between border border-[#f1e8e1]/18 bg-[#212124] px-1.5 py-1 font-mono text-[0.31rem] text-[#eee8e4]/58 sm:px-2 sm:py-1.5 sm:text-[0.38rem]">
                <span>Hero + 5 blocks</span>
                <span>›</span>
              </div>
            </div>
          </div>
          <div className="flex h-7 items-center justify-end gap-2 border-[#f1e8e1]/12 border-t bg-[#202023] px-2 font-mono text-[0.32rem] sm:h-9 sm:px-3 sm:text-[0.39rem]">
            <span className="text-[#eee8e4]/38">Changes saved</span>
            <span className="bg-[#f36458] px-2 py-1 text-[#171719] transition-colors duration-300 group-hover/artifacts:bg-[#ff766b] sm:px-2.5">
              Publish
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PublishedPageArtifact() {
  return (
    <div
      data-sanity-artifact-layer
      className="absolute bottom-[1%] left-[7%] h-[48%] w-[58%] -rotate-[0.8deg] overflow-hidden border border-[#d9c9be]/34 bg-[#e3d8ce] text-[#1a1916] shadow-[0_28px_65px_rgba(5,4,3,.6)]"
    >
      <div className="flex h-7 items-center justify-between border-black/18 border-b px-2.5 font-mono text-[0.39rem] uppercase tracking-[0.1em] text-black/55 sm:h-9 sm:px-3.5 sm:text-[0.46rem]">
        <span>J / Journal</span>
        <span>Stories&nbsp;&nbsp; About</span>
      </div>
      <div className="grid h-[calc(100%-1.75rem)] grid-cols-[43%_57%] sm:h-[calc(100%-2.25rem)]">
        <div className="flex flex-col justify-between border-black/16 border-r p-3 sm:p-4">
          <div>
            <p className="font-mono text-[0.36rem] uppercase tracking-[0.12em] text-black/45 sm:text-[0.42rem]">
              Editorial systems
            </p>
            <p className="text-[0.78rem] leading-[1.05] tracking-[-0.035em] sm:text-base">
              Thoughtful systems for digital publishing.
            </p>
            <p className="mt-2 max-w-[16ch] text-[0.4rem] leading-relaxed text-black/55 sm:mt-3 sm:text-[0.48rem]">
              A structured platform, shaped around the editorial team.
            </p>
          </div>
          <span className="font-mono text-[0.4rem] text-black/62 sm:text-[0.46rem]">
            Read the journal ↗
          </span>
        </div>
        <div className="relative overflow-hidden bg-[#27251f]">
          <Image
            src={publishedEditorialWorkflow}
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1024px) 18vw, 34vw"
            className="object-cover object-center saturate-[.82] contrast-[.94] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover/artifacts:-translate-y-0.5 group-hover/artifacts:translate-x-1 group-hover/artifacts:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
          />
          <div className="absolute inset-0 bg-[#171612]/28" />
          <div className="absolute inset-x-2.5 top-2.5 flex items-center justify-between font-mono text-[0.35rem] uppercase tracking-[0.1em] text-[#f0e8dd]/80 sm:inset-x-3.5 sm:top-3.5 sm:text-[0.4rem]">
            <span>Working surface</span>
            <span>06</span>
          </div>
          <div className="absolute right-2.5 bottom-2.5 left-2.5 border-[#f0e8dd]/38 border-t pt-1.5 font-mono text-[0.34rem] text-[#f0e8dd]/76 sm:right-3.5 sm:bottom-3.5 sm:left-3.5 sm:pt-2 sm:text-[0.4rem]">
            From model to published page
          </div>
        </div>
      </div>
    </div>
  );
}

function ArtifactStack() {
  return (
    <SanityArtifactMotion>
      <div className="absolute inset-x-[8%] top-[7%] h-px bg-[#d1a995]/18" />
      <div className="absolute top-[2%] bottom-[6%] left-[13%] w-px bg-[#d1a995]/14" />
      <ContentModelArtifact />
      <StudioArtifact />
      <PublishedPageArtifact />
    </SanityArtifactMotion>
  );
}

export default async function SanitySpotlightSection() {
  const locale = await getLocale();
  const t = await getTranslations({
    locale,
    namespace: "home.sanitySpotlight",
  });
  const systemItems = t.raw("systemItems") as string[];

  return (
    <section className="contrast-dark overflow-hidden bg-[#a96f52] py-20 text-[#171714] md:py-28 dark:bg-[#281c18] dark:text-[#f1e8e0]">
      <div className="editorial-shell grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-16">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <ArtifactStack />
        </div>

        <AnimatedContainer
          trigger="scroll"
          fadeDirection="right"
          className="order-1 lg:order-2 lg:col-span-6 lg:pl-4 xl:pl-7"
        >
          <p className="editorial-label text-black/58 dark:text-[#d9c6bb]/62">
            {t("label")}
          </p>
          <h2 className="editorial-display mt-5 max-w-[22ch] text-[clamp(2.75rem,3.2vw,3rem)]">
            {t("headline")}
          </h2>
          <p className="mt-7 max-w-[36rem] text-base leading-[1.65] text-black/70 dark:text-[#eadfd7]/72 md:text-[1.05rem]">
            {t("description")}
          </p>
          <div className="mt-9 border-black/28 border-t dark:border-[#ddc9bc]/24">
            {systemItems.map((item) => (
              <div
                key={item}
                className="flex min-h-14 items-center border-black/22 border-b py-3 dark:border-[#ddc9bc]/20"
              >
                <span className="text-sm sm:text-base">{item}</span>
              </div>
            ))}
          </div>
          <Link
            href="/services/sanity"
            className="signal-button group mt-8 inline-flex min-h-12 items-center justify-center gap-3 px-6 motion-safe:active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <span className="whitespace-nowrap">{t("cta")}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
            />
          </Link>
        </AnimatedContainer>
      </div>
    </section>
  );
}
