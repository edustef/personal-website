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
        <div className="border-border grid overflow-hidden border-y lg:grid-cols-[0.7fr_1.3fr]">
          <div className="border-border flex flex-col justify-between gap-12 py-8 lg:border-r lg:py-12 lg:pr-12">
            <div>
              <p className="text-primary text-sm font-medium uppercase tracking-[0.18em]">
                {t("label")}
              </p>
              <p className="text-muted-foreground mt-4 max-w-sm leading-relaxed">
                {t("eyebrow")}
              </p>
            </div>

            <ol className="space-y-0">
              {systemItems.map((item, index) => {
                const Icon = systemIcons[index % systemIcons.length];
                return (
                  <li
                    key={item}
                    className="border-border flex items-center gap-3 border-t py-3 text-sm"
                  >
                    <span className="text-muted-foreground w-6 font-mono text-xs">
                      0{index + 1}
                    </span>
                    <Icon className="text-primary size-4" />
                    <span>{item}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="border-border py-10 lg:border-l lg:py-12 lg:pl-12">
            <h2 className="max-w-2xl text-balance text-4xl leading-tight tracking-tight md:text-5xl">
              {t("headline")}
            </h2>
            <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed text-pretty">
              {t("description")}
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/services/sanity">
                {t("cta")}
                <ArrowRight className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
