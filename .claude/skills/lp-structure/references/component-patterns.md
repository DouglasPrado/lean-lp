# Component Patterns

## Bento Grid (Features)

```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {/* Large card spanning 2 cols */}
  <motion.div className="bg-background/50 border-border/50 rounded-2xl border p-8 backdrop-blur-xl md:col-span-2">
    <h3>{t("feature1.title")}</h3>
    <p>{t("feature1.description")}</p>
    {/* Visual/screenshot */}
  </motion.div>

  {/* Regular cards */}
  <motion.div className="bg-background/50 border-border/50 rounded-2xl border p-8 backdrop-blur-xl">
    <h3>{t("feature2.title")}</h3>
    <p>{t("feature2.description")}</p>
  </motion.div>
</div>
```

## Pricing Card

```tsx
<div
  className={cn(
    "flex flex-col rounded-2xl border p-8",
    isPopular
      ? "border-primary bg-primary/5 shadow-primary/10 scale-105 shadow-lg"
      : "border-border bg-background/50",
  )}
>
  {isPopular && <Badge className="mb-4 self-start">{t("pricing.recommended")}</Badge>}
  <h3 className="text-2xl font-bold">{plan.name}</h3>
  <div className="mt-4 flex items-baseline gap-1">
    <span className="text-4xl font-bold">{plan.price}</span>
    <span className="text-muted-foreground">/{t("pricing.month")}</span>
  </div>
  <ul className="mt-8 flex-1 space-y-3">
    {plan.features.map((f) => (
      <li key={f} className="flex items-center gap-2">
        <Check className="text-primary h-4 w-4" />
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
<div className="bg-background/50 border-border/50 rounded-2xl border p-6 backdrop-blur-xl">
  <div className="mb-4 flex items-center gap-4">
    <Image
      src={testimonial.avatar}
      alt={testimonial.name}
      width={48}
      height={48}
      className="rounded-full"
    />
    <div>
      <p className="font-semibold">{testimonial.name}</p>
      <p className="text-muted-foreground text-sm">
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

;<Accordion type="single" collapsible className="mx-auto w-full max-w-3xl">
  {faqs.map((faq, i) => (
    <AccordionItem key={i} value={`item-${i}`}>
      <AccordionTrigger className="text-left text-lg">{faq.question}</AccordionTrigger>
      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

## CTA Button Pair

```tsx
<div className="flex flex-col justify-center gap-4 sm:flex-row">
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
<div className="bg-primary text-primary-foreground py-2 text-center text-sm">
  <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4">
    <Sparkles className="h-4 w-4" />
    <span>{t("announcement.text")}</span>
    <Link href={t("announcement.link")} className="font-medium underline">
      {t("announcement.cta")}
    </Link>
  </div>
</div>
```

## Social Proof Logo Bar

```tsx
<div className="border-border/50 border-y py-12">
  <div className="mx-auto max-w-7xl px-4">
    <p className="text-muted-foreground mb-8 text-center text-sm">{t("socialProof.title")}</p>
    <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0 md:gap-12">
      {logos.map((logo) => (
        <Image key={logo.name} src={logo.src} alt={logo.name} height={32} className="h-8 w-auto" />
      ))}
    </div>
  </div>
</div>
```
