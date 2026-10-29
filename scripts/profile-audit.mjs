/** Offline, dependency-free structural checks for the GitHub profile README. */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

function attribute(tag, name) {
  const match = tag.match(new RegExp(`(?:\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match ? (match[1] ?? match[2] ?? match[3]) : null;
}

function headingSlug(heading) {
  return heading
    .replace(/<[^>]+>/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*`~]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s/g, '-');
}

/** Returns human-readable issues; it does not access the network. */
export function auditReadme(markdown, { assetExists = () => true } = {}) {
  const issues = [];
  const headings = new Set();
  const seen = new Map();

  // Strip comments and fenced code samples so example links aren't mistaken for real ones.
  const uncommented = markdown.replace(/<!--[\s\S]*?-->/g, '');
  let fence = null;
  const content = uncommented.split(/\r?\n/).map(line => {
    const token = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (token && token[1][0] === fence.char && token[1].length >= fence.size && !token[2].trim()) fence = null;
      return '';
    }
    if (token) { fence = { char: token[1][0], size: token[1].length }; return ''; }
    return line;
  }).join('\n');

  for (const match of content.matchAll(/^ {0,3}#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    const plain = headingSlug(match[1]);
    const repeats = seen.get(plain) ?? 0;
    seen.set(plain, repeats + 1);
    headings.add(repeats ? `${plain}-${repeats}` : plain);
  }
  for (const match of content.matchAll(/\]\(#([^\s)]+)\)|<a\b[^>]*\bhref\s*=\s*['"]#([^'"<>]+)['"][^>]*>/gi)) {
    const anchor = match[1] ?? match[2];
    let decoded = anchor;
    try { decoded = decodeURIComponent(anchor); } catch { /* malformed fragments fail lookup */ }
    if (!headings.has(decoded)) issues.push(`Broken internal navigation: #${anchor}`);
  }

  // GitHub sanitizes many protocols itself, but catch unsafe navigation in source
  // before it reaches the profile. Images are checked separately below.
  const unsafeProtocol = /^(?:javascript|vbscript|data):/i;
  for (const match of content.matchAll(/<a\b[^>]*>/gi)) {
    const href = attribute(match[0], 'href')?.trim() ?? '';
    if (unsafeProtocol.test(href)) issues.push(`Unsafe HTML navigation URL: ${href}`);
  }
  for (const match of content.matchAll(/\]\(\s*<?\s*((?:javascript|vbscript|data):)/gi)) {
    issues.push(`Unsafe Markdown navigation URL: ${match[1]}`);
  }

  function checkAsset(value) {
    if (!value || value.startsWith('https:') || value.startsWith('http:') || value.startsWith('data:')) return;
    const clean = value.split(/[?#]/)[0];
    const parts = clean.replace(/^\.\//, '').split('/');
    if (clean.startsWith('/') || parts.includes('..') || clean.includes('\\')) {
      issues.push(`Image reference outside repository: ${value}`);
      return;
    }
    if (!assetExists(parts.join('/'))) issues.push(`Missing image asset: ${value}`);
  }

  // Verify relative Markdown document links as well as image assets. Only local paths
  // are inspected: external URLs and fragment-only links have separate checks.
  for (const match of content.matchAll(/(?<!!)\[[^\]\n]*\]\(\s*<?((?:\.{1,2}\/|\/)[^)\s>]+)>?\s*\)/g)) {
    const raw = match[1];
    let target = raw.split(/[?#]/)[0];
    try { target = decodeURIComponent(target); } catch { /* invalid escapes stay untrusted */ }
    const parts = target.replace(/^\.\//, '').split('/');
    if (target.startsWith('/') || parts.includes('..') || target.includes('\\')) {
      issues.push(`Local link outside repository: ${raw}`);
    } else if (!assetExists(parts.join('/'))) {
      issues.push(`Missing local link: ${raw}`);
    }
  }

  for (const match of content.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const alt = attribute(tag, 'alt');
    if (alt === null || !alt.trim()) issues.push(`Missing meaningful alt text: ${tag.slice(0, 100)}`);
    checkAsset(attribute(tag, 'src'));
  }
  for (const match of content.matchAll(/<source\b[^>]*>/gi)) {
    const list = attribute(match[0], 'srcset');
    if (list) for (const item of list.split(',')) checkAsset(item.trim().split(/\s+/)[0]);
  }
  for (const match of content.matchAll(/!\[([^\]]*)\]\((\.\/?[^\s)]+)\)/g)) {
    if (!match[1].trim()) issues.push(`Missing meaningful alt text: ${match[0].slice(0, 100)}`);
    checkAsset(match[2]);
  }
  return issues;
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const markdown = await readFile(resolve(root, 'README.md'), 'utf8');
  const issues = auditReadme(markdown, { assetExists: path => existsSync(resolve(root, path)) });
  if (issues.length) {
    issues.forEach(issue => console.error(`FAIL ${issue}`));
    process.exitCode = 1;
  } else {
    console.log('OK README internal navigation, images, alt text and local assets');
  }
}
