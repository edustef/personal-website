import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight,
  Check,
  CircleCheck,
  CircleMinus,
  Clock3,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

type FlowItem = {
  title: string;
  description: string;
};

type Problem = {
  title: string;
  description: string;
};

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

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

const offerKeys = ["build", "migration", "partner"] as const;

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
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end">
          <div>
            <p className="text-primary mb-5 text-sm font-medium uppercase tracking-[0.18em]">
              {t("hero.label")}
            </p>
            <h1 className="max-w-4xl -ml-[0.03em] text-balance text-5xl leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl">
              {t("hero.headline")}
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed text-pretty md:text-xl">
              {t("hero.description")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/schedule">
                  {t("hero.primaryCta")}
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#engagements">{t("hero.secondaryCta")}</a>
              </Button>
            </div>

            <ul className="text-muted-foreground mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {trustItems.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CircleCheck className="text-primary size-4" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside
            className="border-border border-y py-2 lg:border-l lg:border-y-0 lg:py-0 lg:pl-8"
            aria-label={t("hero.flowLabel")}
          >
            <p className="text-muted-foreground py-4 font-mono text-xs uppercase tracking-[0.16em]">
              {t("hero.flowLabel")}
            </p>
            <ol>
              {flow.map((item, index) => (
                <li
                  key={item.title}
                  className="border-border grid grid-cols-[2rem_1fr] gap-3 border-t py-4"
                >
                  <span className="text-primary font-mono text-xs">
                    0{index + 1}
                  </span>
                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            label={t("tension.label")}
            headline={t("tension.headline")}
            description={t("tension.intro")}
          />

          <div className="border-border border-t">
            {problems.map((problem, index) => (
              <article
                key={problem.title}
                className="border-border grid gap-4 border-b py-6 sm:grid-cols-[2rem_1fr]"
              >
                <span className="text-muted-foreground font-mono text-xs">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{problem.title}</h3>
                  <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/25 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionIntro
            label={t("system.label")}
            headline={t("system.headline")}
            description={t("system.intro")}
            className="max-w-3xl"
          />

          <div className="border-border mt-12 grid border-y md:grid-cols-3">
            {capabilities.map((capability) => (
              <article
                key={capability.title}
                className="border-border py-8 md:px-8 md:first:pl-0 md:last:pr-0 md:[&:not(:last-child)]:border-r"
              >
                <p className="text-primary font-mono text-xs uppercase tracking-[0.16em]">
                  {capability.eyebrow}
                </p>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                  {capability.title}
                </h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  {capability.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {capability.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm">
                      <Check className="text-primary mt-0.5 size-4 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="engagements" className="scroll-mt-20 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionIntro
            label={t("offers.label")}
            headline={t("offers.headline")}
            description={t("offers.intro")}
            className="max-w-3xl"
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {offerKeys.map((key) => {
              const offer = t.raw(`offers.${key}`) as Offer;
              const featured = key === "migration";

              return (
                <article
                  key={key}
                  className={
                    featured
                      ? "bg-primary text-primary-foreground flex h-full flex-col rounded-2xl p-7"
                      : "border-border bg-card flex h-full flex-col rounded-2xl border p-7"
                  }
                >
                  <p
                    className={
                      featured
                        ? "text-primary-foreground/75 text-sm"
                        : "text-muted-foreground text-sm"
                    }
                  >
                    {offer.bestFor}
                  </p>
                  <h3 className="mt-4 text-3xl font-semibold tracking-tight">
                    {offer.title}
                  </h3>
                  <p
                    className={
                      featured
                        ? "text-primary-foreground/80 mt-4 leading-relaxed"
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
                  <div
                    className={
                      featured
                        ? "border-primary-foreground/25 mt-auto flex items-center gap-2 border-t pt-6"
                        : "border-border mt-auto flex items-center gap-2 border-t pt-6"
                    }
                  >
                    <Clock3 className="size-4" />
                    <span className="text-sm font-medium">
                      {offer.timeline}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionIntro
            label={t("process.label")}
            headline={t("process.headline")}
            description={t("process.intro")}
            className="max-w-3xl"
          />

          <ol className="border-border mt-12 border-t">
            {processSteps.map((step) => (
              <li
                key={step.number}
                className="border-border grid gap-4 border-b py-7 md:grid-cols-[5rem_0.8fr_1.2fr] md:items-start"
              >
                <span className="text-primary font-mono text-sm">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-muted/25 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            label={t("fit.label")}
            headline={t("fit.headline")}
            description={t("fit.intro")}
          />

          <div className="grid gap-8 sm:grid-cols-2">
            <FitList title={t("fit.goodFitTitle")} items={goodFit} positive />
            <FitList title={t("fit.notFitTitle")} items={notFit} />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <SectionIntro
            label={t("faq.label")}
            headline={t("faq.headline")}
            description={t("faq.subtitle")}
          />

          <Accordion type="single" collapsible className="mt-12 w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={item.question} value={`sanity-faq-${index}`}>
                <AccordionTrigger className="text-left text-balance">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-pretty">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="border-border grid items-end gap-8 border-y py-10 md:grid-cols-[1fr_auto] md:py-14">
            <div>
              <p className="text-primary text-sm font-medium uppercase tracking-[0.18em]">
                {t("final.label")}
              </p>
              <h2 className="mt-4 max-w-3xl text-balance text-4xl tracking-tight md:text-5xl">
                {t("final.headline")}
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed">
                {t("final.description")}
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/schedule">
                {t("final.cta")}
                <ArrowRight className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionIntro({
  label,
  headline,
  description,
  className,
}: {
  label: string;
  headline: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-primary text-sm font-medium uppercase tracking-[0.18em]">
        {label}
      </p>
      <h2 className="mt-4 text-balance text-4xl leading-tight tracking-tight md:text-5xl">
        {headline}
      </h2>
      <p className="text-muted-foreground mt-5 text-lg leading-relaxed text-pretty">
        {description}
      </p>
    </div>
  );
}

function FitList({
  title,
  items,
  positive = false,
}: {
  title: string;
  items: string[];
  positive?: boolean;
}) {
  const Icon = positive ? CircleCheck : CircleMinus;

  return (
    <div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <ul className="border-border mt-5 border-t">
        {items.map((item) => (
          <li
            key={item}
            className="border-border flex items-start gap-3 border-b py-4 text-sm leading-relaxed"
          >
            <Icon className="text-primary mt-0.5 size-4 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
