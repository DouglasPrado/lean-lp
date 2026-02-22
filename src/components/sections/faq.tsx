"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionHeader } from "@/components/shared/section-header"

const staggerItems = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

const questions = ["q1", "q2", "q3", "q4", "q5", "q6"]

export function Faq() {
  const t = useTranslations("faq")

  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerItems}
        >
          <Accordion type="single" collapsible className="w-full">
            {questions.map((q) => (
              <motion.div key={q} variants={fadeUp}>
                <AccordionItem value={q} className="transition-colors duration-200 hover:border-primary/20">
                  <AccordionTrigger className="text-left text-base hover:text-foreground transition-colors">
                    {t(`${q}.question`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {t(`${q}.answer`)}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
