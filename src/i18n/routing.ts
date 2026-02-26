import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "pt-BR", "zh", "hi", "es", "fr"],
  defaultLocale: "en",
})
