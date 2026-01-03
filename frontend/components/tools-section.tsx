import { ToolsSlider } from "@/components/tools-slider";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { getLocale, getTranslations } from "next-intl/server";

export default async function ToolsSection() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <section id="tools" className="w-full py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <AnimatedContainer
          fadeDirection="up"
          className="mb-12 text-center"
        >
          <p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
            {t("tools.label")}
          </p>
          <h2 className="text-foreground mb-4 text-3xl tracking-tight md:text-4xl">
            <a href="#tools" className="hover:text-primary transition-colors">
              {t("tools.headline")}
            </a>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {t("tools.subtitle")}
          </p>
        </AnimatedContainer>
      </div>
      <div className="w-full">
        <ToolsSlider />
      </div>
    </section>
  );
}
