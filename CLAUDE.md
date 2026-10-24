# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

One-page marketing site for "Horizon Wealth Planning", a financial planning firm. Everything lives in a single [index.html](index.html): CSS in one `<style>` tag in `<head>`, JS in one `<script>` tag at the end of `<body>`. This is a hard constraint from the original brief: no frameworks, no build tools, no external JS or CSS files. The only external resources are Google Fonts (Playfair Display for headings, Inter for body text), the Unsplash hero image and the pravatar.cc avatars.

## Commands

There is no build, lint or test tooling.

- Open in the default browser (PowerShell): `Start-Process .\index.html`
- Check JS syntax, by extracting the inline script and running Node on it:
  ```bash
  sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d' > "$TEMP/hw_check.js" && node --check "$TEMP/hw_check.js"
  ```

## Architecture

The page is organised into numbered, commented sections in each language. Keep that numbering when adding sections.

- **CSS** opens with design tokens on `:root` (colors such as `--navy #0B2545`, `--gold #C9A227` and `--bg #F7F9FC`, plus the spacing scale, `--nav-height` and others). Use these tokens rather than hard-coded values. Styles are mobile-first, with `min-width` overrides grouped at the end in two blocks, 768px (tablet) and 1024px (desktop). Don't scatter media queries through the file. A `prefers-reduced-motion` block comes last.
- **HTML** order: sticky `<header>`/`<nav>`, then `#home` hero, then `#testimonials` carousel, then `#contact` enquiry form inside `<main>`, then `<footer>` and the back-to-top button. Nav and footer links are anchors to these ids. `scroll-padding-top: var(--nav-height)` offsets anchor jumps so the sticky header doesn't cover them.
- **JS** runs inside one `DOMContentLoaded` handler. Behaviour that spans several parts of the file:
  - **Fade-ins**: any element with the `.fade-in` class (plus optional `.delay-1` to `.delay-3`) is revealed by an IntersectionObserver that adds `.is-visible`.
  - **Stat counters**: they read `data-target`, `data-prefix` and `data-suffix` from `.stat-number` elements.
  - **Carousel**: slide count is taken from the DOM, so you can add or remove `<article class="carousel-slide">` elements without touching the JS. Update each slide's `aria-label="n of N"` when you do. Star icons are injected into `.stars` by JS. Cards per view are 1 or 3, chosen by the `(min-width: 1024px)` media query, which must stay in sync with the CSS rule that sets `.carousel-slide` `flex-basis` to `calc(100% / 3)`. Dots are rebuilt whenever the cards-per-view count changes. Slides outside the current view get `aria-hidden` and `inert`.
  - **Enquiry form validation**: driven by the `validators` object, keyed by field `name`. Each validator returns an error message, or `""` when the field is valid. Every field needs a matching `<span id="{name}-error">`. To add a field, add the markup, its error span and a `validators` entry. The radio group and consent checkbox put their red border on a wrapper element (see `borderTarget`). On a valid submit, the form data is logged as JSON and the form is replaced by a success message. User input is inserted with `textContent` only.
  - `EMAIL_RE` is shared by the enquiry form and the newsletter form.

## v2 revamp ([v2/index.html](v2/index.html), served at `/v2/`)

v1 (root `index.html`) stays live unchanged. v2 follows the same single-file rules and section numbering, with these differences:

- **Strict CSP and Trusted Types** in a `<meta>` tag that must stay first in `<head>`. Script and style are allowed only by SHA-256 hash, so after any edit to the inline CSS or JS run `node scripts/check-csp.mjs v2/index.html --write` (CI fails otherwise). Never use `innerHTML`, inline `style="..."` attributes or inline event handlers: Trusted Types and the CSP block them. Build DOM with `createElement`/`textContent`, or clone a `<template>` (`#star-tpl`, `#success-tpl`). Setting `el.style.x` from JS is fine. HTML files must stay LF (see `.gitattributes`), or the hashes won't match what Pages serves.
- **No third-party images.** Avatars are CSS initials (`.avatar.av-1` to `av-4`). Icons and the "Penny" piggy mascot are `<symbol>`s in the SVG sprite at the top of `<body>`, used via `<use href="#id">`. Google Fonts (Fredoka + Nunito) is the only external resource.
- **Clickjacking guard** (JS section 0) runs before the `DOMContentLoaded` handler. It's the one exception to the single-handler rule.
- **Forms**: every form has a `.hp` honeypot input named `website`. `isLikelyBot` also rejects submits within 3s of page load, and `throttled` blocks repeats within 5s. Bot submissions get a fake success message and are never sent. All captured data goes through `sendLead()` (the placeholder for a real backend), which applies `csvSafe`. Inputs are run through `clean()` (strips control chars, caps length).
  - The quiz-tips, checklist and newsletter forms share `setupEmailGate(form, onSuccess)`.
  - The enquiry form keeps the `validators` pattern. `message` is optional and `ageRange` was removed. The honeypot and the hidden `leadSource` field have no validators entry.
- **Lead tracking**: any link with `data-source` (`[a-z0-9:-]`) and/or `data-interest` (an exact `#interest` option value) sets `leadSource` and pre-selects the interest when clicked.
- **Quiz** content lives in the `QUIZ` and `PERSONAS` constants. Each persona maps to an `interest` option.
- **Media queries**: inline nav shows at ≥1024px (hamburger below that). The sticky mobile CTA hides at ≥1024px. A `print` block (prints only the unlocked checklist) comes before `prefers-reduced-motion`.

## Content notes

The address, phone number, email address and testimonials are placeholders.
