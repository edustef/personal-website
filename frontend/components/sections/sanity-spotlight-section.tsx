import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Braces, Layers3, ScanText } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

const systemIcons = [ScanText, Layers3, Braces];

export default async function SanitySpotlightSection() {
  const locale = await getLocale();
  const t = await getTranslations({
    locale,
    namespace: "home.sanitySpotlight",
  });
  const systemItems = t.raw("systemItems") as string[];

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <p className="text-primary text-sm font-medium uppercase tracking-wider">
            {t("label")}
          </p>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-balance text-3xl leading-tight tracking-tight md:text-5xl">
            {t("headline")}
          </h2>
          <p className="text-muted-foreground mt-5 max-w-2xl text-lg leading-relaxed text-pretty">
            {t("description")}
          </p>
        </AnimatedContainer>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {systemItems.map((item, index) => {
            const Icon = systemIcons[index % systemIcons.length];
            return (
              <AnimatedContainer
                key={item}
                trigger="scroll"
                fadeDirection="up"
                staggerIndex={index}
                className="flex flex-col items-center rounded-2xl bg-muted/30 p-6 text-center"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <p className="mt-4 font-medium">{item}</p>
              </AnimatedContainer>
            );
          })}
        </div>

        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mt-8 text-center"
        >
          <Button asChild size="lg">
            <Link href="/services/sanity">
              {t("cta")}
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        </AnimatedContainer>
      </div>
    </section>
  );
}
