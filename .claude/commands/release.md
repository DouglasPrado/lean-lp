# Release Checklist

Execute this checklist before every deploy/release of the landing page.
Uses Semantic Release for automated versioning and changelog generation.

## Pre-Release

1. **Code Quality**
   - [ ] TypeScript: run `npx tsc --noEmit` — zero errors
   - [ ] Lint: run `npx eslint . --max-warnings 0` — zero warnings
   - [ ] Format: run `npx prettier --check .`
   - [ ] No console.log statements in production code
   - [ ] No TODO/FIXME comments remaining

2. **Tests**
   - [ ] Unit tests: run `npx vitest run` — all pass
   - [ ] E2E tests: run `npx playwright test` — all pass
   - [ ] Storybook: run `npx storybook build` — builds without errors
   - [ ] Visual regression: check Storybook snapshots

3. **i18n** (ref: template em `.claude/templates/snippets/i18n-message-template.json`)
   - [ ] All translation keys exist in every locale file (pt-BR.json, en.json)
   - [ ] Keys match the structure in i18n-message-template.json
   - [ ] No hardcoded strings in components
   - [ ] Crowdin sync is up to date: `npx crowdin push && npx crowdin pull`
   - [ ] Language switcher works correctly
   - [ ] Run: `diff <(jq -S 'keys_unsorted | .[]' messages/pt-BR.json) <(jq -S 'keys_unsorted | .[]' messages/en.json)` — no diff

4. **SEO** (ref: `.claude/skills/lp-seo/SKILL.md`)
   - [ ] Meta title <= 60 chars per locale
   - [ ] Meta description 150-160 chars per locale
   - [ ] OG image exists and is 1200x630px
   - [ ] JSON-LD schemas validate (paste in Google Rich Results Test)
   - [ ] Sitemap.xml accessible at /sitemap.xml
   - [ ] Robots.txt accessible at /robots.txt
   - [ ] Canonical URLs set correctly
   - [ ] hreflang tags present for all locales
   - [ ] H1 exists and is unique per page

5. **Performance**
   - [ ] Run Lighthouse audit — all scores > 90
   - [ ] LCP < 2.5s
   - [ ] CLS < 0.1
   - [ ] INP < 200ms
   - [ ] All images use next/image with proper sizing
   - [ ] Hero image has priority flag
   - [ ] No unused CSS/JS in bundle
   - [ ] Run `npx next build` — zero warnings

6. **Visual QA**
   - [ ] Test all breakpoints: mobile (375px), tablet (768px), desktop (1280px), wide (1536px)
   - [ ] Dark mode works (if applicable)
   - [ ] All animations trigger correctly on scroll
   - [ ] No layout shift on page load
   - [ ] Forms work and validate correctly
   - [ ] All links point to correct destinations
   - [ ] Images have alt text

## Commit & Release

7. **Git Hygiene**
   - [ ] All commits follow Conventional Commits (use `npx cz`)
   - [ ] Husky hooks running: `pre-commit` (lint-staged) + `commit-msg` (commitlint)
   - [ ] Branch is up to date with `main`
   - [ ] No merge conflicts
   - [ ] PR reviewed and approved

8. **Semantic Release Pipeline**
   Triggered automatically on merge to `main` via CI:
   ```
   @semantic-release/commit-analyzer    → Determine version bump (patch/minor/major)
   @semantic-release/release-notes-gen  → Generate release notes from commits
   @semantic-release/changelog          → Update CHANGELOG.md
   @semantic-release/npm                → Bump package.json version (no publish)
   @semantic-release/git                → Commit CHANGELOG + version, create tag
   @semantic-release/github             → Create GitHub Release
   ```

   Config (`.releaserc.json` or `package.json`):
   ```json
   {
     "branches": ["main"],
     "plugins": [
       ["@semantic-release/commit-analyzer", { "preset": "conventionalcommits" }],
       "@semantic-release/release-notes-generator",
       "@semantic-release/changelog",
       ["@semantic-release/npm", { "npmPublish": false }],
       "@semantic-release/git",
       "@semantic-release/github"
     ]
   }
   ```

   Commitizen config:
   ```json
   {
     "config": {
       "commitizen": {
         "path": "@commitlint/cz-commitlint"
       }
     }
   }
   ```

## Deploy

9. **Build & Deploy**
   - [ ] `npm run build` succeeds with zero errors
   - [ ] Preview deployment working on Vercel
   - [ ] Environment variables set in Vercel
   - [ ] Custom domain configured and SSL active
   - [ ] Redirects configured (www → non-www or vice versa)

## Post-Release

10. **Verification**
    - [ ] Production URL loads correctly
    - [ ] All locales accessible (/pt-BR, /en)
    - [ ] OG tags render on social media (use https://opengraph.xyz)
    - [ ] Google Search Console — submit sitemap
    - [ ] Analytics tracking confirmed (events firing)
    - [ ] Error monitoring active (Sentry or similar)
    - [ ] GitHub Release created with correct version tag
    - [ ] CHANGELOG.md updated automatically
