import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { type FAQ, faqs } from "@/lib/data/faqs";
import { getWhatsAppUrl } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
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
    <section
      id="faq"
      className="editorial-section scroll-mt-16 border-[var(--section-rule)] border-t bg-background text-foreground dark:bg-[var(--dark-background)]"
    >
      <div className="editorial-shell grid gap-14 lg:grid-cols-12 lg:gap-10 xl:gap-14">
        <div className="lg:col-span-4 lg:pr-8 xl:pr-14">
          <p className="editorial-label editorial-section-label">
            {t("label")}
          </p>
          <h2 className="editorial-section-title mt-6 max-w-[10ch]">
            {t("headline")}
          </h2>
          <p className="editorial-section-copy mt-6 max-w-[25rem]">
            {t("subtitle")}
          </p>
        </div>

        <div className="lg:col-span-8">
          <Accordion
            type="single"
            collapsible
            defaultValue="faq-2"
            className="motion-reduce:[&_[data-slot=accordion-content]]:animate-none"
          >
            {sortedFaqs.map((faq) => (
              <AccordionItem key={faq._id} value={faq._id} className="border-0">
                <AccordionTrigger className="group min-h-20 items-center rounded-none py-5 text-left text-[1.2rem] leading-[1.25] font-normal tracking-[-0.025em] hover:text-primary hover:no-underline focus-visible:border-transparent focus-visible:ring-primary/85 focus-visible:ring-offset-4 focus-visible:ring-offset-background dark:focus-visible:ring-offset-[var(--dark-background)] sm:min-h-24 sm:py-6 sm:text-[1.4rem] md:text-[1.55rem] [&>svg]:hidden after:ml-3 after:flex after:size-11 after:shrink-0 after:items-center after:justify-center after:font-mono after:text-[1.8rem] after:leading-none after:font-light after:text-current after:content-['+'] data-[state=open]:text-foreground data-[state=open]:after:text-primary data-[state=open]:after:content-['−']">
                  {t(faq.questionKey)}
                </AccordionTrigger>
                <AccordionContent className="editorial-section-copy max-w-[46rem] pr-12 pb-8 sm:pr-16 sm:pb-10">
                  {t(faq.answerKey)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="editorial-text-link group mt-8"
          >
            <span>{t("cta")}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
