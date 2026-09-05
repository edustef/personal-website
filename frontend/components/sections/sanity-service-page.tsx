import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Blocks,
  Braces,
  Check,
  CircleCheck,
  CircleMinus,
  Clock3,
  Code2,
  Compass,
  FileSearch,
  Gauge,
  Layers3,
  MessageSquareText,
  RefreshCcw,
  Rocket,
  ScanText,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Workflow,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

type FlowItem = { title: string; description: string };
type Problem = { title: string; description: string };
type Capability = {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
};
type Offer = {
  title: string;
  bestFor: string;
  description: string;
  timeline: string;
  features: string[];
};
type ProcessStep = { title: string; description: string };
type FAQItem = { question: string; answer: string };

const offerKeys = ["build", "migration", "partner"] as const;
const trustIcons = [UsersRound, Code2, RefreshCcw];
const flowIcons = [ScanText, Blocks, Braces, Workflow];
const problemIcons = [MessageSquareText, Layers3, FileSearch];
const capabilityIcons = [ScanText, Sparkles, Code2];
const offerIcons = [Blocks, RefreshCcw, UsersRound];
const processIcons = [Compass, Code2, SearchCheck, Rocket];

export default async function SanityServicePage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "sanityService" });

  const flow = t.raw("hero.flow") as FlowItem[];
  const problems = t.raw("tension.problems") as Problem[];
  const capabilities = t.raw("system.capabilities") as Capability[];
  const processSteps = t.raw("process.steps") as ProcessStep[];
  const goodFit = t.raw("fit.goodFit") as string[];
  const notFit = t.raw("fit.notFit") as string[];
  const faqItems = t.raw("faq.items") as FAQItem[];
  const trustItems = t.raw("hero.trust") as string[];

  return (
    <>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center text-center">
            <AnimatedContainer
              className="flex max-w-4xl flex-col items-center"
              duration={2.5}
              delay={0.1}
              ease="veryGentle"
              offset={16}
            >
              <p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
                {t("hero.label")}
              </p>
              <h1 className="text-foreground text-balance text-4xl leading-tight md:text-6xl">
                {t("hero.headline")}
              </h1>
              <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed text-pretty md:text-xl">
                {t("hero.description")}
              </p>
            </AnimatedContainer>

            <AnimatedContainer
              className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
              duration={2}
              delay={0.35}
              ease="veryGentle"
              offset={12}
            >
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/schedule">
                  {t("hero.primaryCta")}
                  <ArrowRight className="size-5 transition-transform duration-200 group-hover/btn:translate-x-0.5 motion-reduce:transform-none" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <a href="#engagements">{t("hero.secondaryCta")}</a>
              </Button>
            </AnimatedContainer>

            <AnimatedContainer
              className="text-muted-foreground mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
              duration={2}
              delay={0.5}
              ease="veryGentle"
              offset={8}
            >
              {trustItems.map((item, index) => {
                const Icon = trustIcons[index % trustIcons.length];
                return (
                  <span key={item} className="flex items-center gap-1.5">
                    <Icon className="text-primary size-4" />
                    {item}
                  </span>
                );
              })}
            </AnimatedContainer>
          </div>

          <AnimatedContainer
            trigger="scroll"
            fadeDirection="up"
            className="mt-14 rounded-3xl bg-muted/30 p-6 sm:p-8 md:mt-16"
          >
            <p className="text-muted-foreground text-center text-sm font-medium uppercase tracking-wider">
              {t("hero.flowLabel")}
            </p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {flow.map((item, index) => {
                const Icon = flowIcons[index % flowIcons.length];
                return (
                  <div key={item.title} className="text-center">
                    <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <h2 className="mt-4 font-semibold">{item.title}</h2>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed text-pretty">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </AnimatedContainer>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader
            label={t("tension.label")}
            headline={t("tension.headline")}
            subtitle={t("tension.intro")}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {problems.map((problem, index) => {
              const Icon = problemIcons[index % problemIcons.length];
              return (
                <AnimatedContainer
                  key={problem.title}
                  trigger="scroll"
                  fadeDirection="up"
                  staggerIndex={index}
                  className="rounded-2xl bg-muted/30 p-6 md:p-8"
                >
                  <Icon className="text-primary size-6" />
                  <h3 className="mt-5 text-xl font-semibold text-balance">
                    {problem.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 leading-relaxed text-pretty">
                    {problem.description}
                  </p>
                </AnimatedContainer>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader
            label={t("system.label")}
            headline={t("system.headline")}
            subtitle={t("system.intro")}
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {capabilities.map((capability, index) => {
              const Icon = capabilityIcons[index % capabilityIcons.length];
              return (
                <AnimatedContainer
                  key={capability.title}
                  trigger="scroll"
                  fadeDirection="up"
                  staggerIndex={index}
                  className="flex h-full flex-col rounded-2xl bg-muted/30 p-7 md:p-8"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <p className="text-primary mt-6 text-sm font-medium uppercase tracking-wider">
                    {capability.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-balance">
                    {capability.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 leading-relaxed text-pretty">
                    {capability.description}
                  </p>
                  <ul className="mt-7 space-y-3">
                    {capability.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm"
                      >
                        <Check className="text-primary mt-0.5 size-4 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </AnimatedContainer>
              );
            })}
          </div>
        </div>
      </section>

      <section id="engagements" className="scroll-mt-20 py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader
            label={t("offers.label")}
            headline={t("offers.headline")}
            subtitle={t("offers.intro")}
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {offerKeys.map((key, index) => {
              const offer = t.raw(`offers.${key}`) as Offer;
              const featured = key === "migration";
              const Icon = offerIcons[index % offerIcons.length];
              return (
                <AnimatedContainer
                  key={key}
                  trigger="scroll"
                  fadeDirection="up"
                  staggerIndex={index}
                  className={
                    featured
                      ? "flex h-full flex-col rounded-2xl bg-primary p-7 text-primary-foreground md:p-8"
                      : "flex h-full flex-col rounded-2xl bg-muted/30 p-7 md:p-8"
                  }
                >
                  <div
                    className={
                      featured
                        ? "flex size-12 items-center justify-center rounded-xl bg-primary-foreground/15"
                        : "flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    }
                  >
                    <Icon className="size-6" />
                  </div>
                  <p
                    className={
                      featured
                        ? "mt-6 text-sm text-primary-foreground/75"
                        : "text-muted-foreground mt-6 text-sm"
                    }
                  >
                    {offer.bestFor}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                    {offer.title}
                  </h3>
                  <p
                    className={
                      featured
                        ? "mt-4 leading-relaxed text-primary-foreground/80"
                        : "text-muted-foreground mt-4 leading-relaxed"
                    }
                  >
                    {offer.description}
                  </p>
                  <ul className="mt-7 space-y-3">
                    {offer.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm"
                      >
                        <Check className="mt-0.5 size-4 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center gap-2 pt-8">
                    <Clock3 className="size-4" />
                    <span className="text-sm font-medium">
                      {offer.timeline}
                    </span>
                  </div>
                </AnimatedContainer>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader
            label={t("process.label")}
            headline={t("process.headline")}
            subtitle={t("process.intro")}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {processSteps.map((step, index) => {
              const Icon = processIcons[index % processIcons.length];
              return (
                <AnimatedContainer
                  key={step.title}
                  trigger="scroll"
                  fadeDirection="up"
                  staggerIndex={index}
                  className="rounded-2xl bg-muted/30 p-6 md:p-8"
                >
                  <Icon className="text-primary size-6" />
                  <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground mt-3 leading-relaxed text-pretty">
                    {step.description}
                  </p>
                </AnimatedContainer>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader
            label={t("fit.label")}
            headline={t("fit.headline")}
            subtitle={t("fit.intro")}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <FitList title={t("fit.goodFitTitle")} items={goodFit} positive />
            <FitList title={t("fit.notFitTitle")} items={notFit} />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <SectionHeader
            label={t("faq.label")}
            headline={t("faq.headline")}
            subtitle={t("faq.subtitle")}
          />
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, index) => (
              <AnimatedContainer
                key={item.question}
                trigger="scroll"
                fadeDirection="up"
                staggerIndex={index}
              >
                <AccordionItem
                  value={`sanity-faq-${index}`}
                  className="rounded-2xl border-0 bg-muted/30 px-6"
                >
                  <AccordionTrigger className="text-left text-balance">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-pretty">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </AnimatedContainer>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <AnimatedContainer
            trigger="scroll"
            fadeDirection="up"
            className="flex flex-col items-center rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-10 md:py-16"
          >
            <Gauge className="size-8" />
            <p className="mt-6 text-sm font-medium uppercase tracking-wider text-primary-foreground/75">
              {t("final.label")}
            </p>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl tracking-tight md:text-5xl">
              {t("final.headline")}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-primary-foreground/80 text-pretty">
              {t("final.description")}
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8">
              <Link href="/schedule">
                {t("final.cta")}
                <ArrowRight className="size-5" />
              </Link>
            </Button>
          </AnimatedContainer>
        </div>
      </section>
    </>
  );
}

function FitList({
  title,
  items,
  positive = false,
}: { title: string; items: string[]; positive?: boolean }) {
  const Icon = positive ? CircleCheck : CircleMinus;
  return (
    <AnimatedContainer
      trigger="scroll"
      fadeDirection="up"
      className="rounded-2xl bg-muted/30 p-6 md:p-8"
    >
      <div className="flex items-center gap-3">
        {positive ? (
          <ShieldCheck className="text-primary size-6" />
        ) : (
          <CircleMinus className="text-primary size-6" />
        )}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm leading-relaxed"
          >
            <Icon className="text-primary mt-0.5 size-4 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </AnimatedContainer>
  );
}
