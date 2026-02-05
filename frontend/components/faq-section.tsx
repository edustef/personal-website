import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { Button } from "@/components/ui/button";
import { type FAQ, faqs } from "@/lib/data/faqs";
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

  const phone = profileT("phone");
  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace(/[^0-9]/g, "")}`
    : "https://wa.me/40775378525";

  const sortedFaqs = [...faqsToDisplay].sort((a, b) => a.order - b.order);

  return (
    <section id="faq" className="scroll-mt-16 py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <AnimatedContainer
          trigger="scroll"
          fadeDirection="up"
          className="mb-16 text-center"
        >
          <p className="text-primary mb-3 text-sm font-medium uppercase tracking-wider">
            {t("label")}
          </p>
          <h2 className="text-foreground mb-4 text-3xl tracking-tight md:text-4xl text-balance">
            <a href="#faq" className="hover:text-primary transition-colors">
              {t("headline")}
            </a>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
            {t("subtitle")}
          </p>
        </AnimatedContainer>

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
