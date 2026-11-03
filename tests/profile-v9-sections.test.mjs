import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditReadme } from '../scripts/profile-audit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readme = await readFile(resolve(root, 'README.md'), 'utf8');
const sections = [
  ['Design systems and interface craft', 'design-systems-and-interface-craft'],
  ['API and data contracts', 'api-and-data-contracts'],
  ['Resilience and recovery', 'resilience-and-recovery'],
  ['Technical writing and decisions', 'technical-writing-and-decisions'],
  ['Questions I am exploring', 'questions-i-am-exploring'],
];

test('V9 adds five distinct navigable sections with meaningful text', () => {
  for (const [title, anchor] of sections) {
    const marker = `## ${title}`;
    const start = readme.indexOf(marker);
    assert.ok(start >= 0, `Missing ${title}`);
    assert.ok(readme.includes(`href="#${anchor}"`), `Missing nav link #${anchor}`);
    const next = readme.indexOf('\n## ', start + marker.length);
    const section = readme.slice(start, next < 0 ? undefined : next);
    assert.ok(section.length >= 340, `${title} needs practical content`);
  }
});

test('V9 adds distinct diagrams with meaningful descriptions and no missing files', () => {
  for (const asset of ['design-craft.svg', 'api-contracts.svg', 'resilience.svg']) {
    assert.ok(existsSync(resolve(root, 'assets', asset)), `Missing ${asset}`);
    assert.match(readme, new RegExp(`<img[^>]+src="\\./assets/${asset}"[^>]+alt="[^"]{35,}"`));
  }
});

test('V9 decisions reference public projects and future ideas are explicitly exploratory', () => {
  const data = readme.split('## API and data contracts')[1]?.split('\n## ')[0] ?? '';
  const reliability = readme.split('## Resilience and recovery')[1]?.split('\n## ')[0] ?? '';
  const plans = readme.split('## Questions I am exploring')[1]?.split('\n## ')[0] ?? '';
  assert.ok(data.includes('https://github.com/rahman-997/venues-api'));
  assert.ok(data.includes('https://github.com/rahman-997/bookbookhaven'));
  assert.ok(reliability.includes('https://github.com/rahman-997/eventify'));
  assert.match(plans, /not a shipping roadmap|not a release promise/i);
});

test('V9 retains sound navigation, image alternatives and local images', () => {
  assert.deepEqual(auditReadme(readme, { assetExists: path => existsSync(resolve(root, path)) }), []);
});
