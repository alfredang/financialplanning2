# financialplanning2

One-page website for **Horizon Wealth Planning**, built with plain HTML, CSS and vanilla JavaScript in a single `index.html`. No frameworks or build step: open `index.html` in a browser.

![Deploy](https://github.com/alfredang/financialplanning2/actions/workflows/pages.yml/badge.svg)

**Live site:** https://alfredang.github.io/financialplanning2/

![Horizon Wealth Planning homepage](docs/screenshot.png)

## Features

- **Sticky header** with anchor navigation and a mobile hamburger menu. Anchor jumps are offset so the header never covers a section heading.
- **Hero** with a full-width background image, a headline and animated stat counters (15+ years, 1,200+ clients, $500M managed). The counters read `data-target`, `data-prefix` and `data-suffix`.
- **Testimonials carousel** with six client cards, previous/next buttons and dot navigation. It shows 1 card per view on mobile and 3 on desktop (≥1024px). Off-screen slides are hidden from assistive technology with `aria-hidden` and `inert`.
- **Enquiry form** with client-side validation for name, email, phone (digits only), age range, area of interest, preferred contact method, message and consent. Errors show inline under each field. A valid submission logs the data as JSON to the console and swaps the form for a success message. Nothing is sent to a server.
- **Footer** with quick links, contact details, social links and a newsletter sign-up that uses the same email validation as the enquiry form.
- **Back-to-top button**, plus scroll-triggered fade-in animations through `IntersectionObserver`.
- **Responsive and accessible**: mobile-first CSS with tablet (768px) and desktop (1024px) breakpoints, ARIA labels, live error regions, and support for `prefers-reduced-motion`.

## Tech stack

- HTML5, CSS3 (custom properties, flexbox, grid) and vanilla JavaScript (ES6+)
- Google Fonts: Playfair Display (headings) and Inter (body)
- Images: Unsplash (hero) and pravatar.cc (testimonial avatars)
- No frameworks, build tools or external JS/CSS files

## Getting started

There is nothing to install or build.

```bash
git clone https://github.com/alfredang/financialplanning2.git
cd financialplanning2
```

Then open `index.html` in a browser. On Windows (PowerShell): `Start-Process .\index.html`.

To check the JavaScript syntax locally (needs Node.js):

```bash
sed -n '/<script>/,/<\/script>/p' index.html | sed '1d;$d' > /tmp/hw_check.js && node --check /tmp/hw_check.js
```

## Project structure

```
.
├── index.html                    # The whole site: CSS in <head>, JS at the end of <body>
├── .github/workflows/pages.yml   # CI checks and GitHub Pages deployment
├── docs/screenshot.png           # README screenshot (not deployed)
├── CLAUDE.md                     # Notes for Claude Code (not deployed)
└── README.md
```

Inside `index.html`, the CSS, HTML and JS are split into numbered, commented sections. The CSS opens with design tokens on `:root` (for example `--navy`, `--gold` and the spacing scale).

## Deployment and CI/CD

[.github/workflows/pages.yml](.github/workflows/pages.yml) has two jobs:

1. **check** runs on every push and pull request to `main`. It runs:
   - a [gitleaks](https://github.com/gitleaks/gitleaks) secret scan over the full git history
   - `node --check` on the inline `<script>` from `index.html`
   - a check that fails if `index.html` loads any external script, or any stylesheet other than Google Fonts
2. **deploy** runs after `check` passes, on pushes to `main` and on manual runs. It copies only the public site files (`index.html`) into `_site/` and publishes that folder to GitHub Pages. Tooling files such as `CLAUDE.md` are never served.

Deployment happens automatically on every push to `main`. To redeploy by hand, use **Actions → Deploy to GitHub Pages → Run workflow**, or run:

```bash
gh workflow run pages.yml
```

## Notes

- The address, phone number, email address and testimonials are **placeholders**. Replace them before using the site for real.
- The enquiry and newsletter forms don't send data anywhere. Connect them to a backend or form service to collect submissions.
- No license has been chosen yet.
