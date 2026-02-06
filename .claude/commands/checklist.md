# QA Checklist — Landing Page SaaS

Execute this checklist for quality assurance before any significant update.

## Content & Copy

> **Skill reference**: Validar contra os frameworks em `.claude/skills/lp-copy/SKILL.md`

- [ ] All headlines pass the "So what?" test (ver Hero formula em lp-copy)
- [ ] CTAs use action verbs (not "Click here")
- [ ] No placeholder text remaining (Lorem ipsum, TODO, etc.)
- [ ] Pricing values are correct and up to date
- [ ] Testimonials have real names, roles, and companies
- [ ] FAQ answers are accurate and helpful
- [ ] Footer links all work
- [ ] Legal pages (Privacy, Terms) exist and are linked

## Design & UX

> **Skill reference**: Validar contra os padrões em `.claude/skills/lp-structure/SKILL.md`

- [ ] Visual hierarchy is clear — eye flows naturally
- [ ] CTA buttons are visually prominent
- [ ] Sufficient color contrast (WCAG AA minimum)
- [ ] Touch targets >= 44px on mobile
- [ ] No horizontal scroll on any breakpoint
- [ ] Consistent spacing between sections
- [ ] Framer-style animations are smooth (no jank)
- [ ] Glassmorphism effects render correctly

## Responsive

- [ ] Mobile 375px — everything readable, no overflow
- [ ] Tablet 768px — grid adjusts correctly
- [ ] Desktop 1280px — full layout renders
- [ ] Wide 1536px — content doesn't stretch awkwardly
- [ ] Navbar hamburger menu works on mobile
- [ ] Pricing cards stack nicely on mobile
- [ ] Images scale proportionally

## Functionality

- [ ] All anchor links scroll to correct sections
- [ ] Language switcher changes locale and preserves route
- [ ] External links open in new tab (target="_blank" rel="noopener")
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader compatible (proper ARIA labels)
- [ ] No JavaScript errors in console
- [ ] Forms validate input before submission
- [ ] CTA buttons link to correct destinations (signup, demo, etc.)

## Performance

> **Skill reference**: Validar contra Core Web Vitals em `.claude/skills/lp-seo/SKILL.md`

- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Total Blocking Time < 200ms
- [ ] Bundle size reasonable (< 200KB JS gzipped)
- [ ] Images optimized (WebP, proper dimensions)
- [ ] No render-blocking resources
- [ ] Font loading doesn't cause FOUT/FOIT

## Cross-Browser

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Android Chrome

## Analytics & Tracking

- [ ] Page view tracking working
- [ ] CTA click events firing
- [ ] Scroll depth tracking (if applicable)
- [ ] Conversion funnel tracking set up
- [ ] UTM parameters preserved through navigation

## Color & Theme

> **Skill reference**: Usar `.claude/skills/lp-colors/SKILL.md` para validação

- [ ] Primary color has sufficient contrast for button text (WCAG AA)
- [ ] Dark mode renders correctly (all CSS variables defined in `.dark`)
- [ ] Glassmorphism cards visible in both light and dark
- [ ] Chart colors are distinguishable (chart-1 through chart-5)
- [ ] Muted backgrounds don't wash out text
