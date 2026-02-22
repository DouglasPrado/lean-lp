"use client"

import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

const navLinks = [
  { href: "#como-funciona", key: "howItWorks" },
  { href: "#beneficios", key: "benefits" },
  { href: "#features", key: "features" },
  { href: "#faq", key: "faq" },
]

export function Navbar() {
  const t = useTranslations("navbar")
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="border-border/50 bg-background/80 fixed top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <motion.a
          href="#"
          className="text-3xl font-bold tracking-tight"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          dify<span className="text-primary">.</span>
        </motion.a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <motion.a
              key={link.key}
              href={link.href}
              className="text-muted-foreground hover:text-foreground relative text-sm transition-colors"
              whileHover="hover"
            >
              {t(link.key)}
              <motion.span
                className="bg-primary absolute -bottom-1 left-0 h-px w-full origin-left"
                initial={{ scaleX: 0 }}
                variants={{ hover: { scaleX: 1 } }}
                transition={{ duration: 0.2, ease: "easeOut" as const }}
              />
            </motion.a>
          ))}
        </nav>

        <div className="hidden md:block">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild size="sm">
              <a href="#agendar-demo">{t("cta")}</a>
            </Button>
          </motion.div>
        </div>

        <motion.button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" as const }}
            className="border-border/50 bg-background overflow-hidden border-t md:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.key}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {t(link.key)}
                </motion.a>
              ))}
              <Button asChild size="sm" className="w-full">
                <a href="#agendar-demo">{t("cta")}</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
