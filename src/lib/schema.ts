export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "LeanERP",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "ERP",
    operatingSystem: "Windows, macOS, Linux",
    description:
      "ERP modular para micro e pequenas empresas do varejo. 100% offline, ultra-rápido, funciona em qualquer computador.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      lowPrice: "19",
      highPrice: "300",
      offerCount: "3",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "100% offline operation",
      "Millisecond response times",
      "Modular on-demand system",
      "Runs on any hardware",
      "Complete POS",
      "Inventory control",
      "Financial management",
      "Real-time reports",
      "Multi-store support",
    ],
  }
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LeanERP",
    url: "https://leanerp.com.br",
    logo: "https://leanerp.com.br/logo.png",
    description:
      "ERP modular, 100% offline, ultra-rápido para micro e pequenas empresas do varejo.",
    sameAs: ["https://twitter.com/leanerp", "https://linkedin.com/company/leanerp"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["Portuguese", "English"],
    },
  }
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LeanERP",
    url: "https://leanerp.com.br",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://leanerp.com.br/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }
}
