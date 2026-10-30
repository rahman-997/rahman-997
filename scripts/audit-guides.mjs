/** Offline audit of local Markdown paths in the extended engineering field guides. */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export function guideIssues(text, { baseDir, projectRoot, exists = existsSync } = {}) {
  const issues = [];
  // Do not treat examples inside fenced code as navigational links.
  const clean = text.replace(/^\s*(```|~~~)[\s\S]*?^\s*\1.*$/gm, '');
  for (const match of clean.matchAll(/!?\[[^\]\n]*\]\(\s*<?([^\s)>]+)>?\s*\)/g)) {
    const target = match[1];
    if (target.startsWith('#') || /^https?:\/\//i.test(target) || /^mailto:/i.test(target)) continue;
    if (/^[a-z]+:/i.test(target)) { issues.push(`Unsupported link protocol: ${target}`); continue; }
    let path = target.split(/[?#]/)[0];
    try { path = decodeURIComponent(path); } catch { issues.push(`Invalid link encoding: ${target}`); continue; }
    if (path.startsWith('/') || path.includes('\\')) { issues.push(`Invalid local link: ${target}`); continue; }
    const full = resolve(baseDir, path);
    if (relative(projectRoot, full).split(sep).includes('..') || !exists(full)) issues.push(`Missing/outside file: ${target}`);
  }
  return issues;
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const guides = (await readdir(resolve(root, 'docs'))).filter(name => name.endsWith('.md')).sort();
  const errors = [];
  for (const path of guides) {
    const full = resolve(root, 'docs', path);
    const markdown = await readFile(full, 'utf8');
    errors.push(...guideIssues(markdown, {baseDir:dirname(full),projectRoot:root}).map(error=>`${path}: ${error}`));
  }
  if (errors.length) { errors.forEach(x=>console.error(x)); process.exitCode=1; }
  else console.log(`OK ${guides.length} guides: local links resolve and stay within the repository`);
}
