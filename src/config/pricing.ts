export const pricingConfig = {
  currency: "BRL",
  trial: {
    days: 30,
    requiresCard: false,
  },
  plans: [
    {
      key: "minus" as const,
      monthlyPrice: 19,
      yearlyPrice: 15,
      featureCount: 4,
      isPopular: false,
    },
    {
      key: "essential" as const,
      monthlyPrice: 89,
      yearlyPrice: 71,
      featureCount: 5,
      isPopular: true,
    },
    {
      key: "hardcore" as const,
      monthlyPrice: 300,
      yearlyPrice: 240,
      featureCount: 6,
      isPopular: false,
    },
  ],
}

export type PlanKey = (typeof pricingConfig.plans)[number]["key"]
