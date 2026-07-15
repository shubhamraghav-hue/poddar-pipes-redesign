import { SectionHeading } from "@/components/shared/SectionHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { faqs } from "@/lib/data/faq";

export function FAQ() {
  return (
    <section className="bg-paper-2 py-24 md:py-28">
      <div className="container-edge grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <RevealOnScroll>
          <SectionHeading
            eyebrow="FAQ"
            title="Answers before you reach out."
            description="Can't find what you're looking for? Send us a message and a team member will follow up directly."
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