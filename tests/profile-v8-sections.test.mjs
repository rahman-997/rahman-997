import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditReadme } from '../scripts/profile-audit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readme = await readFile(resolve(root, 'README.md'), 'utf8');
const sections = [
  ['Engineering principles', 'engineering-principles'],
  ['Quality and security', 'quality-and-security'],
  ['Performance and accessible UX', 'performance-and-accessible-ux'],
  ['Collaboration and handoff', 'collaboration-and-handoff'],
  ['Explore the code', 'explore-the-code'],
];

test('V8 adds five distinct, navigable substantive sections', () => {
  for (const [title, slug] of sections) {
    const heading = `## ${title}`;
    const position = readme.indexOf(heading);
    assert.ok(position >= 0, `Missing heading: ${title}`);
    assert.ok(readme.includes(`href="#${slug}"`), `Missing navigation for ${title}`);
    const rest = readme.slice(position + heading.length);
    const next = rest.indexOf('\n## ');
    assert.ok((next < 0 ? rest : rest.slice(0, next)).trim().length >= 270,
      `Section ${title} needs substantive, specific content`);
  }
});

test('V8 adds illustrated quality and accessibility guidance', () => {
  for (const asset of ['quality-gates.svg', 'inclusive-ux.svg']) {
    assert.ok(existsSync(resolve(root, 'assets', asset)), `${asset} not found`);
    assert.match(readme, new RegExp(`<img[^>]*src="\\./assets/${asset}"[^>]*alt="[^"]{30,}"`),
      `Missing descriptive alt on ${asset}`);
  }
});

test('V8 keeps repository-tour references grounded in named source projects', () => {
  const section = readme.split('## Explore the code')[1]?.split('\n## ')[0] ?? '';
  for (const source of ['eventify', 'bookbookhaven', 'fitflow-gym', 'mizan-finance', 'venues-api']) {
    assert.ok(section.includes(`https://github.com/rahman-997/${source}`), `Missing ${source}`);
  }
});

test('new sections introduce no broken local navigation or image assets', () => {
  assert.deepEqual(auditReadme(readme, { assetExists: path => existsSync(resolve(root, path)) }), []);
});
