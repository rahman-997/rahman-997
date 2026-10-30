import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditReadme } from '../scripts/profile-audit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const markdown = await readFile(resolve(root, 'README.md'), 'utf8');
const additions = [
  ['Find your starting point', 'find-your-starting-point'],
  ['Systems behind the screens', 'systems-behind-the-screens'],
  ['Delivery, end to end', 'delivery-end-to-end'],
  ['AI and automation lab', 'ai-and-automation-lab'],
  ['Languages and inclusive UX', 'languages-and-inclusive-ux'],
];

test('new areas have headings and appear in quick navigation', () => {
  for (const [heading, anchor] of additions) {
    assert.ok(markdown.includes(`## ${heading}`), `Missing ${heading}`);
    assert.ok(markdown.includes(`href="#${anchor}"`), `Missing quick link to ${heading}`);
  }
});

test('new sections provide examples or context, not empty placeholders', () => {
  for (let i = 0; i < additions.length; i++) {
    const start = markdown.indexOf(`## ${additions[i][0]}`);
    const end = markdown.indexOf('\n## ', start + 4);
    const body = markdown.slice(start, end === -1 ? undefined : end);
    assert.ok(body.length > 180, `${additions[i][0]} lacks meaningful content`);
  }
});

test('architecture and delivery visuals have descriptive alternatives', () => {
  assert.match(markdown, /<img\s+src="\.\/assets\/architecture\.svg"\s+alt="[^"]{28,}"/);
  assert.match(markdown, /<img\s+src="\.\/assets\/delivery\.svg"\s+alt="[^"]{28,}"/);
  for (const file of ['assets/architecture.svg', 'assets/delivery.svg']) {
    assert.ok(existsSync(resolve(root, file)), `${file} is missing`);
  }
});

test('inclusive section names all four languages and marks RTL text', () => {
  const section = markdown.split('## Languages and inclusive UX')[1]?.split('\n## ')[0] ?? '';
  for (const language of ['العربية', 'Türkçe', 'English', 'فارسی']) {
    assert.ok(section.includes(language), `Missing ${language}`);
  }
  assert.match(section, /dir="rtl"/);
});

test('updated README remains structurally sound', () => {
  assert.deepEqual(auditReadme(markdown, { assetExists: path => existsSync(resolve(root, path)) }), []);
});
