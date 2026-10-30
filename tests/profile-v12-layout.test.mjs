import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditReadme } from '../scripts/profile-audit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readme = await readFile(resolve(root, 'README.md'), 'utf8');
const position = heading => readme.indexOf(`## ${heading}`);

test('V12 prioritizes practical evidence and contact ahead of detailed engineering essays', () => {
  for (const title of ['About my work', 'Find your starting point', 'Selected work', 'Evidence and verification map', "Let's connect", 'Engineering toolkit', 'Systems behind the screens']) {
    assert.notEqual(position(title), -1, `Missing ${title}`);
  }
  assert.ok(position('Selected work') < position('Evidence and verification map'));
  assert.ok(position('Evidence and verification map') < position("Let's connect"));
  assert.ok(position("Let's connect") < position('Systems behind the screens'));
  assert.ok(position('Engineering toolkit') < position('Systems behind the screens'));
});

test('V12 features three different specialties and collapses supplementary projects', () => {
  const selected = readme.slice(position('Selected work'), position('Evidence and verification map'));
  const firstThree = ['### Eventify', '### BookHaven', '### Mizan Finance'].map(name => selected.indexOf(name));
  assert.ok(firstThree.every(index => index >= 0) && firstThree[0] < firstThree[1] && firstThree[1] < firstThree[2]);
  const summary = selected.match(/<details>\s*<summary><strong>More projects[^\n]*<\/strong><\/summary>/);
  assert.ok(summary, 'Supplementary projects need a collapsed summary');
  for (const title of ['### FitFlow', '### Venues API', '### Engineering Portfolio']) {
    assert.ok(selected.indexOf(title) > summary.index, `Expected ${title} inside supplementary group`);
  }
  assert.ok(selected.includes('</details>'));
  assert.doesNotMatch(selected, /<table\b/i);
});

test('V12 topic navigation uses themed groups and keeps existing headings reachable', () => {
  const menu = readme.slice(readme.indexOf('<summary>Explore more topics</summary>'), position('About my work'));
  for (const group of ['Systems &amp; data', 'Product &amp; accessibility', 'Quality &amp; delivery', 'Practice &amp; learning']) {
    assert.ok(menu.includes(group), `Missing topic group ${group}`);
  }
  for (const anchor of ['#systems-behind-the-screens', '#quality-and-security', '#rtl-and-localization-qa', '#incident-response-rehearsal']) {
    assert.ok(menu.includes(`href="${anchor}"`), `Missing topic link ${anchor}`);
  }
});

test('V12 avoids duplicated headings and keeps README links and artwork auditable', () => {
  const headingList = [...readme.matchAll(/^## (.+)$/gm)].map(match => match[1]);
  assert.equal(new Set(headingList).size, headingList.length);
  assert.deepEqual(auditReadme(readme, { assetExists: p => existsSync(resolve(root, p)) }), []);
});
