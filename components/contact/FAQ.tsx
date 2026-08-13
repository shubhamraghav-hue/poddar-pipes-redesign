import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const FAQ_COUNT = 11;

interface FAQProps {
  /** Skip the built-in eyebrow/heading — for pages (like the dedicated FAQ
   * page) that render their own header above this component instead. */
  hideHeading?: boolean;
}

export async function FAQ({ hideHeading = false }: FAQProps = {}) {
  const t = await getTranslations("faq");
  const faqs = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: t(`q${i}` as never),
    answer: t(`a${i}` as never),
  }));

  const accordion = (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  if (hideHeading) {
    return <RevealOnScroll className="mx-auto max-w-3xl">{accordion}</RevealOnScroll>;
  }

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
        <RevealOnScroll delay={0.1}>{accordion}</RevealOnScroll>
      </div>
    </section>
  );
}
