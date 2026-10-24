// Check (or, with --write, update) the CSP hashes for the inline <style> and <script> in a page.
// Usage: node scripts/check-csp.mjs v2/index.html [--write]
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const [file, flag] = process.argv.slice(2);
if (!file) {
  console.error("Usage: node scripts/check-csp.mjs <file.html> [--write]");
  process.exit(2);
}

let html = readFileSync(file, "utf8");
if (html.includes("\r\n")) {
  console.error(`${file} has CRLF line endings; GitHub Pages serves LF, so the hashes would not match.`);
  process.exit(1);
}

const inline = (tag) => {
  const matches = [...html.matchAll(new RegExp(`^[ \\t]*<${tag}>([\\s\\S]*?)</${tag}>`, "gm"))];
  if (matches.length !== 1) {
    console.error(`Expected exactly one inline <${tag}>, found ${matches.length}.`);
    process.exit(1);
  }
  return matches[0][1];
};

const hash = (text) => `'sha256-${createHash("sha256").update(text, "utf8").digest("base64")}'`;
const expected = { "script-src": hash(inline("script")), "style-src": hash(inline("style")) };

const cspMatch = html.match(/http-equiv="Content-Security-Policy" content="([^"]*)"/);
if (!cspMatch) {
  console.error(`No Content-Security-Policy meta tag in ${file}.`);
  process.exit(1);
}

let csp = cspMatch[1];
const stale = Object.entries(expected).filter(([directive, value]) => !csp.includes(`${directive} ${value}`));

if (!stale.length) {
  console.log(`${file}: CSP hashes are up to date.`);
  process.exit(0);
}

if (flag === "--write") {
  for (const [directive, value] of stale) {
    csp = csp.replace(new RegExp(`${directive} '[^']*'`), `${directive} ${value}`);
  }
  html = html.replace(cspMatch[1], csp);
  writeFileSync(file, html);
  console.log(`${file}: updated ${stale.map(([d]) => d).join(" and ")} hash.`);
} else {
  for (const [directive, value] of stale) console.error(`${file}: ${directive} should be ${value}`);
  console.error(`Run: node scripts/check-csp.mjs ${file} --write`);
  process.exit(1);
}
