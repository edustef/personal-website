import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { type FAQ, faqs } from "@/lib/data/faqs";
import { getWhatsAppUrl } from "@/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

type FAQSectionProps = {
  faqs?: FAQ[];
};

export default async function FAQSection({ faqs: faqsProp }: FAQSectionProps) {
  const faqsToDisplay = faqsProp || faqs;
  if (!faqsToDisplay || faqsToDisplay.length === 0) {
    return null;
  }

  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "faq" });
  const profileT = await getTranslations({ locale, namespace: "profile" });

  const whatsappUrl = getWhatsAppUrl(profileT("phone"));

  const sortedFaqs = [...faqsToDisplay].sort((a, b) => a.order - b.order);

  return (
    <section id="faq" className="scroll-mt-16 py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <SectionHeader
          label={t("label")}
          headline={t("headline")}
          subtitle={t("subtitle")}
          anchorSlug="faq"
          className="mb-16 px-0"
        />

        <Accordion type="single" collapsible className="w-full">
          {sortedFaqs.map((faq, index) => (
            <AnimatedContainer
              key={faq._id}
              trigger="scroll"
              fadeDirection="up"
              staggerIndex={index}
              staggerDelay={0.08}
            >
              <AccordionItem value={faq._id}>
                <AccordionTrigger className="text-left text-balance">
                  {t(faq.questionKey)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-pretty">
                  {faq._id === "faq-5"
                    ? t.rich(faq.answerKey, {
                        link: (chunks) => (
                          <a
                            href="#how-i-price"
                            className="text-primary hover:underline"
                          >
                            {chunks}
                          </a>
                        ),
                      })
                    : t(faq.answerKey)}
                </AccordionContent>
              </AccordionItem>
            </AnimatedContainer>
          ))}
        </Accordion>

        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mt-12 text-center"
        >
          <Button asChild size="lg" variant="outline">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              {t("cta")}
            </a>
          </Button>
        </AnimatedContainer>
      </div>
    </section>
  );
}
