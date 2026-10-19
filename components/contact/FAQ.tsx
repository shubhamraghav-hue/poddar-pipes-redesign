import { getTranslations } from "next-intl/server";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const FAQ_COUNT = 6;

/**
 * FAQ list — Figma "FAQs Page" 1979:32754 (questions 1989:36433).
 *
 * Each row is a 1112px block (of the 1212 content width) between #c0c0c0
 * rules, 60px side padding: question 20px SemiBold #171796 caps (30 above,
 * 10 below), a 28px close "X" on the right, answer 16px #606060 at 920px wide
 * (10 above, 40 below). Figma draws every row open, so all start open; the
 * icon is the accordion's Plus turned 45deg, i.e. Figma's X while open.
 */
export async function FAQ() {
  const t = await getTranslations("faq");
  const faqs = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: t(`q${i}` as never),
    answer: t(`a${i}` as never),
  }));

  return (
    <RevealOnScroll className="max-w-[1112px]">
      <Accordion
        type="multiple"
        defaultValue={faqs.map((_, i) => `item-${i}`)}
        className="w-full border-t border-[#c0c0c0]"
      >
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-b border-[#c0c0c0]">
            <AccordionTrigger className="gap-6 px-0 pb-[10px] pt-[30px] type-sub font-semibold uppercase text-[#171796] hover:text-[#171796] sm:px-[60px] [&>svg]:size-7 [&>svg]:text-[#171796] [&>svg]:[stroke-width:1.5]">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="px-0 pb-10 pt-[10px] type-body text-[#606060] sm:px-[60px] md:max-w-[1040px]">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </RevealOnScroll>
  );
}
