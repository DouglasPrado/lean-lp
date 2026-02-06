"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function Faq() {
  const t = useTranslations("faq")

  const faqs = [
    { id: "q1", question: t("q1.question"), answer: t("q1.answer") },
    { id: "q2", question: t("q2.question"), answer: t("q2.answer") },
    { id: "q3", question: t("q3.question"), answer: t("q3.answer") },
    { id: "q4", question: t("q4.question"), answer: t("q4.answer") },
    { id: "q5", question: t("q5.question"), answer: t("q5.answer") },
    { id: "q6", question: t("q6.question"), answer: t("q6.answer") },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          {/* Left column — heading + support link (desktop) */}
          <div className="md:col-span-2">
            <h2 className="text-foreground text-4xl font-semibold">{t("title")}</h2>
            <p className="text-muted-foreground mt-4 text-lg text-balance">{t("subtitle")}</p>
            <p className="text-muted-foreground mt-6 hidden md:block">
              {t("support")}{" "}
              <Link href="#" className="text-primary font-medium hover:underline">
                {t("supportLink")}
              </Link>
            </p>
          </div>

          {/* Right column — accordion */}
          <div className="md:col-span-3">
            <Accordion type="single" collapsible>
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border-dotted">
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Support link — mobile only */}
          <p className="text-muted-foreground mt-6 md:hidden">
            {t("support")}{" "}
            <Link href="#" className="text-primary font-medium hover:underline">
              {t("supportLink")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
