# Color Theory for SaaS Landing Pages

## Choosing Primary + Secondary

### Primary Color
The primary color is your brand identity. It should:
- Represent the brand personality (trust=blue, energy=orange, innovation=purple)
- Work well as button backgrounds and interactive elements
- Have enough contrast for white/dark text on top
- Recommended lightness range: 35-55% (HSL)

### Secondary Color
The secondary supports and contrasts the primary:
- Complementary: opposite on color wheel (high contrast, vibrant)
- Analogous: adjacent on color wheel (harmonious, subtle)
- Triadic: 120° apart (balanced, dynamic)
- Split-complementary: adjacent to the complementary (versatile)

### Recommended Pairings by SaaS Category

| Category | Primary | Secondary | Example |
|----------|---------|-----------|---------|
| Dev Tools | Indigo #6366f1 | Pink #ec4899 | Vercel-like |
| Finance | Blue #3b82f6 | Emerald #10b981 | Stripe-like |
| Health | Teal #14b8a6 | Orange #f97316 | Calm-like |
| Marketing | Purple #8b5cf6 | Yellow #eab308 | HubSpot-like |
| Productivity | Blue #2563eb | Slate #64748b | Notion-like |
| AI/ML | Violet #7c3aed | Cyan #06b6d4 | OpenAI-like |
| E-commerce | Orange #f97316 | Slate #475569 | Shopify-like |
| Education | Green #22c55e | Blue #3b82f6 | Duolingo-like |

## shadcn/ui Color System

shadcn/ui uses CSS variables with HSL values (without `hsl()` wrapper):

```
--primary: 262 83% 58%;        /* The main brand color */
--primary-foreground: 0 0% 98%; /* Text color ON primary */
```

### Semantic Color Slots

| Variable | Purpose | Typical Usage |
|----------|---------|---------------|
| `background` | Page background | `<body>` |
| `foreground` | Default text | Headings, body text |
| `card` | Card surfaces | Pricing cards, feature cards |
| `primary` | Brand color | CTA buttons, active states |
| `secondary` | Supporting surfaces | Secondary buttons, tags |
| `muted` | Subdued surfaces | Code blocks, disabled areas |
| `accent` | Highlights | Hover states, selected items |
| `destructive` | Error/danger | Delete buttons, error messages |
| `border` | Borders | Card borders, dividers |
| `ring` | Focus rings | Keyboard focus indicators |

## Style Presets

| Preset | Character | When to Use |
|--------|-----------|-------------|
| `minimal` | Clean, spacious, white | Corporate SaaS, serious tone |
| `soft` | Warm, approachable | Consumer SaaS, friendly tone |
| `bold` | Vibrant, saturated | Startup, disruptive tone |
| `dark-first` | Moody, premium | Dev tools, premium products |

## Contrast Requirements (WCAG)

- Normal text: 4.5:1 minimum contrast ratio
- Large text (18px+ or 14px+ bold): 3:1 minimum
- UI components: 3:1 minimum against adjacent colors
- Primary button text must pass contrast against primary background
