import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { type FAQ, faqs } from "@/lib/data/faqs";
import { getWhatsAppUrl } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

type FAQSectionProps = { faqs?: FAQ[] };

export default async function FAQSection({ faqs: faqsProp }: FAQSectionProps) {
  const items = faqsProp || faqs;
  if (!items?.length) return null;
  const locale = await getLocale();
  const [t, profileT] = await Promise.all([
    getTranslations({ locale, namespace: "faq" }),
    getTranslations({ locale, namespace: "profile" }),
  ]);
  const whatsappUrl = getWhatsAppUrl(profileT("phone"));
  const sortedFaqs = [...items].sort((a, b) => a.order - b.order);

  return (
    <section id="faq" className="scroll-mt-16 py-24 md:py-36">
      <div className="editorial-shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="editorial-label">{t("label")}</p>
          <h2 className="editorial-display mt-5 text-5xl sm:text-6xl">
            {t("headline")}
          </h2>
          <p className="text-muted-foreground mt-6 max-w-sm leading-relaxed">
            {t("subtitle")}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block border-foreground/50 border-b pb-1 font-medium hover:border-primary"
          >
            {t("cta")} ↗
          </a>
        </div>

        <Accordion
          type="single"
          collapsible
          className="border-border/70 border-t lg:col-span-8"
        >
          {sortedFaqs.map((faq) => (
            <AccordionItem
              key={faq._id}
              value={faq._id}
              className="border-border/70"
            >
              <AccordionTrigger className="min-h-20 py-5 text-left text-xl font-normal tracking-tight hover:text-primary hover:no-underline md:text-2xl">
                {t(faq.questionKey)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground max-w-2xl pb-7 text-base leading-relaxed md:text-lg">
                {t(faq.answerKey)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
