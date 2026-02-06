# Component Patterns

## Bento Grid (Features)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Large card spanning 2 cols */}
  <motion.div className="md:col-span-2 bg-background/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8">
    <h3>{t("feature1.title")}</h3>
    <p>{t("feature1.description")}</p>
    {/* Visual/screenshot */}
  </motion.div>

  {/* Regular cards */}
  <motion.div className="bg-background/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8">
    <h3>{t("feature2.title")}</h3>
    <p>{t("feature2.description")}</p>
  </motion.div>
</div>
```

## Pricing Card

```tsx
<div className={cn(
  "rounded-2xl border p-8 flex flex-col",
  isPopular
    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-105"
    : "border-border bg-background/50"
)}>
  {isPopular && (
    <Badge className="self-start mb-4">
      {t("pricing.recommended")}
    </Badge>
  )}
  <h3 className="text-2xl font-bold">{plan.name}</h3>
  <div className="mt-4 flex items-baseline gap-1">
    <span className="text-4xl font-bold">{plan.price}</span>
    <span className="text-muted-foreground">/{t("pricing.month")}</span>
  </div>
  <ul className="mt-8 space-y-3 flex-1">
    {plan.features.map(f => (
      <li key={f} className="flex items-center gap-2">
        <Check className="h-4 w-4 text-primary" />
        <span>{f}</span>
      </li>
    ))}
  </ul>
  <Button className="mt-8 w-full" variant={isPopular ? "default" : "outline"}>
    {plan.cta}
  </Button>
</div>
```

## Testimonial Card

```tsx
<div className="bg-background/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
  <div className="flex items-center gap-4 mb-4">
    <Image
      src={testimonial.avatar}
      alt={testimonial.name}
      width={48}
      height={48}
      className="rounded-full"
    />
    <div>
      <p className="font-semibold">{testimonial.name}</p>
      <p className="text-sm text-muted-foreground">
        {testimonial.role}, {testimonial.company}
      </p>
    </div>
  </div>
  <p className="text-muted-foreground">{testimonial.quote}</p>
</div>
```

## FAQ Accordion

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

<Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
  {faqs.map((faq, i) => (
    <AccordionItem key={i} value={`item-${i}`}>
      <AccordionTrigger className="text-left text-lg">
        {faq.question}
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground">
        {faq.answer}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

## CTA Button Pair

```tsx
<div className="flex flex-col sm:flex-row gap-4 justify-center">
  <Button size="lg" className="rounded-full px-8">
    {t("cta.primary")}
    <ArrowRight className="ml-2 h-4 w-4" />
  </Button>
  <Button size="lg" variant="outline" className="rounded-full px-8">
    {t("cta.secondary")}
  </Button>
</div>
```

## Announcement Bar

```tsx
<div className="bg-primary text-primary-foreground text-sm py-2 text-center">
  <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
    <Sparkles className="h-4 w-4" />
    <span>{t("announcement.text")}</span>
    <Link href={t("announcement.link")} className="underline font-medium">
      {t("announcement.cta")}
    </Link>
  </div>
</div>
```

## Social Proof Logo Bar

```tsx
<div className="py-12 border-y border-border/50">
  <div className="max-w-7xl mx-auto px-4">
    <p className="text-center text-sm text-muted-foreground mb-8">
      {t("socialProof.title")}
    </p>
    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
      {logos.map(logo => (
        <Image key={logo.name} src={logo.src} alt={logo.name} height={32} className="h-8 w-auto" />
      ))}
    </div>
  </div>
</div>
```
