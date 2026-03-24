"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { siteConfig } from "@/config/site"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}

const iconItem = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
}

const integrations = [
  // Comunicação
  { name: "WhatsApp", domain: "whatsapp.com" },
  { name: "Gmail", domain: "mail.google.com" },
  { name: "Slack", domain: "slack.com" },
  { name: "Telegram", domain: "telegram.org" },
  // CRM & Vendas
  { name: "HubSpot", domain: "hubspot.com" },
  { name: "LinkedIn", domain: "linkedin.com" },
  // Produtividade
  { name: "Notion", domain: "notion.so" },
  { name: "Google Calendar", domain: "calendar.google.com" },
  { name: "Google Sheets", domain: "docs.google.com" },
  { name: "Linear", domain: "linear.app" },
  { name: "Jira", domain: "jira.atlassian.com" },
  // Marketing
  { name: "Instagram", domain: "instagram.com" },
  { name: "X", domain: "x.com" },
  // Pagamentos
  { name: "Stripe", domain: "stripe.com" },
  { name: "Mercado Pago", domain: "mercadopago.com.br" },
  { name: "Asaas", domain: "asaas.com" },
  // Analytics
  { name: "Google Analytics", domain: "analytics.google.com" },
  { name: "Mixpanel", domain: "mixpanel.com" },
  // Infraestrutura & Dev
  { name: "Vercel", domain: "vercel.com" },
  { name: "Netlify", domain: "netlify.com" },
  { name: "AWS", domain: "aws.amazon.com" },
  { name: "Sentry", domain: "sentry.io" },
  // Conteúdo & Mídia
  { name: "Google Drive", domain: "drive.google.com" },
  { name: "Figma", domain: "figma.com" },
]

function faviconUrl(domain: string) {
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=64`
}

export function SocialProof() {
  const t = useTranslations("integrations")

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="group/section border-border/80 bg-card relative grid items-center gap-10 overflow-hidden rounded-3xl border p-8 md:grid-cols-2 md:p-12">
          {/* Dot pattern overlay (matches BentoGrid cards) */}
          <div className="absolute inset-0 opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:4px_4px] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
          </div>
          {/* Gradient border overlay */}
          <div className="via-border/50 absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-transparent to-transparent p-px opacity-100 transition-opacity duration-300" />

          {/* Left Side */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="relative"
          >
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground text-sm font-semibold tracking-wider uppercase"
            >
              {t("label")}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-3 mb-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            >
              {t("title")}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-muted-foreground mb-8 text-base leading-relaxed md:text-lg"
            >
              {t("description")}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href={siteConfig.links.demo} target="_blank" rel="noopener noreferrer">{t("cta")}</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#como-funciona">{t("ctaSecondary")}</a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Side — Favicon Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="relative grid grid-cols-6 gap-3 md:gap-4"
          >
            {integrations.map((integration) => (
              <motion.div
                key={integration.name}
                variants={iconItem}
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                className="group relative flex items-center justify-center"
                title={integration.name}
              >
                <div
                  className="bg-background border-border/80 group-hover:border-primary/40 group-hover:bg-primary/5 flex h-14 w-14 items-center justify-center border-2 shadow-sm transition-colors duration-200 md:h-16 md:w-16"
                  style={{
                    clipPath:
                      "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={faviconUrl(integration.domain)}
                    alt={integration.name}
                    width={28}
                    height={28}
                    loading="lazy"
                    className="h-6 w-6 object-contain md:h-7 md:w-7"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
