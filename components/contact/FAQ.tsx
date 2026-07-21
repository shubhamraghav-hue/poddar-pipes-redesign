import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FAQ_COUNT = 11;

export async function FAQ() {
  const t = await getTranslations("faq");
  const faqs = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: t(`q${i}` as never),
    answer: t(`a${i}` as never),
  }));

  return (
    <section className="bg-paper-2 py-24 md:py-28">
      <div className="container-edge grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <RevealOnScroll>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("heading")}
            description={t("desc")}
          />
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </RevealOnScroll>
      </div>
    </section>
  );
}
