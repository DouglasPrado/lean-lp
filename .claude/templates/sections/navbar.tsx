"use client"

import { LanguageSwitcher } from "@/components/shared/language-switcher"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import React, { useEffect, useState } from "react"

export function Navbar() {
  const t = useTranslations("navbar")
  const [menuState, setMenuState] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: t("features"), href: "#features" },
    { label: t("pricing"), href: "#pricing" },
    { label: t("faq"), href: "#faq" },
  ]

  return (
    <header>
      <nav data-state={menuState ? "active" : undefined} className="group fixed z-50 w-full px-2">
        <div
          className={cn(
            "mx-auto mt-2 max-w-7xl px-6 transition-all duration-300 lg:px-12",
            isScrolled && "bg-background/50 max-w-5xl rounded-2xl border backdrop-blur-lg lg:px-5",
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* Brand + Mobile toggle */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="text-primary flex items-center space-x-2 text-xl font-bold"
              >
                {t("brand")}
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="m-auto size-6 duration-200 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 scale-0 -rotate-180 opacity-0 duration-200 group-data-[state=active]:scale-100 group-data-[state=active]:rotate-0 group-data-[state=active]:opacity-100" />
              </button>
            </div>

            {/* Desktop centered nav links */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150"
                    >
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA + Mobile menu panel */}
            <div className="bg-background mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 group-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:group-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent">
              {/* Mobile nav links */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {navLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuState(false)}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action buttons */}
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <LanguageSwitcher />
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn(isScrolled && "lg:hidden")}
                >
                  <Link href="#">
                    <span>{t("login")}</span>
                  </Link>
                </Button>
                <Button asChild size="sm" className={cn(isScrolled && "lg:hidden")}>
                  <Link href="#">
                    <span>{t("cta")}</span>
                  </Link>
                </Button>
                <Button asChild size="sm" className={cn(isScrolled ? "lg:inline-flex" : "hidden")}>
                  <Link href="#">
                    <span>{t("cta")}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
