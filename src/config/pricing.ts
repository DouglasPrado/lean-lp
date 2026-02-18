export const pricingConfig = {
  currency: "BRL",
  trial: {
    days: 14,
    requiresCard: false,
  },
  plans: [
    {
      key: "free" as const,
      monthlyPrice: 0,
      yearlyPrice: 0,
      featureCount: 4,
      isPopular: false,
    },
    {
      key: "pro" as const,
      monthlyPrice: 97,
      yearlyPrice: 77,
      featureCount: 5,
      isPopular: true,
    },
  ],
}

export type PlanKey = (typeof pricingConfig.plans)[number]["key"]
