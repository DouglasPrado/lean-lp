export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Dify",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "AI Agent Platform",
    operatingSystem: "Windows, macOS, Linux",
    description:
      "Seu time de agentes de IA que trabalha enquanto você dorme. Pesquisa, documentação, análise de dados, automações, integrações — tudo via conversa.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      lowPrice: "0",
      highPrice: "97",
      offerCount: "2",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "85",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Chat that executes tasks via natural conversation",
      "Automated multi-step recipes with parallel execution",
      "Specialized agents that work as a team",
      "Knowledge base with intelligent semantic search",
      "50+ ready-made app connections",
      "Task scheduler with natural language",
      "Smart protection with sensitive data detection",
      "Multi-LLM support (GPT, Claude, Gemini, Ollama)",
      "Real-time visual dashboard",
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
    name: "Dify",
    url: "https://dify.com.br",
    logo: "https://dify.com.br/logo.png",
    description:
      "Plataforma de agentes de IA que trabalham enquanto você dorme. Pesquisa, execução, automação — tudo via conversa.",
    sameAs: [
      "https://twitter.com/difyagent",
      "https://github.com/DouglasPrado/dify-agent",
    ],
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
    name: "Dify",
    url: "https://dify.com.br",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://dify.com.br/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }
}
