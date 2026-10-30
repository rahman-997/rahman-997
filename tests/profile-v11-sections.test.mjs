import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditReadme } from '../scripts/profile-audit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readme = await readFile(resolve(root, 'README.md'), 'utf8');
const headings = [
  ['Decisions in context', 'decisions-in-context'],
  ['From feature brief to acceptance test', 'from-feature-brief-to-acceptance-test'],
  ['Verification ladder', 'verification-ladder'],
  ['Incident response rehearsal', 'incident-response-rehearsal'],
  ['RTL and localization QA', 'rtl-and-localization-qa'],
];
function section(title) {
  const start = readme.indexOf(`## ${title}`);
  assert.ok(start !== -1, `Missing V11 heading: ${title}`);
  const stop = readme.indexOf('\n## ', start + 4);
  return readme.slice(start, stop < 0 ? undefined : stop);
}

test('five V11 topics have practical, distinct content and navigable anchors', () => {
  for (const [heading, slug] of headings) {
    assert.ok(readme.includes(`href="#${slug}"`), `Missing navigation to ${slug}`);
    assert.ok(section(heading).length > 450, `Section ${heading} lacks useful depth`);
  }
});

test('decisions are grounded in actual source systems, without claiming universal implementation', () => {
  const body = section('Decisions in context');
  for (const repo of ['mizan-finance', 'eventify', 'bookbookhaven', 'venues-api']) {
    assert.ok(body.includes(`https://github.com/rahman-997/${repo}`), `Missing ${repo} source`);
  }
  assert.match(body, /trade-off|tradeoff|constraint/i);
});

test('acceptance tests include happy, failure and accessibility cases', () => {
  const body = section('From feature brief to acceptance test');
  assert.match(body, /Given[\s\S]*When[\s\S]*Then/);
  assert.match(body, /error|failure|conflict/i);
  assert.match(body, /keyboard|screen reader|focus/i);
});

test('verification ladder distinguishes offline evidence from production signals', () => {
  const body = section('Verification ladder');
  for (const part of ['unit', 'contract', 'UI', 'live']) assert.ok(body.includes(part));
  assert.match(body, /not a guarantee|cannot prove|does not prove/i);
});

test('incident drills are explicitly hypothetical and contain a rollback decision', () => {
  const body = section('Incident response rehearsal');
  assert.match(body, /exercise|hypothetical|rehearsal/i);
  assert.match(body, /rollback/i);
  assert.match(body, /owner|responsib|communication/i);
});

test('localization checklist covers mixed direction, Persian orthography and accessibility', () => {
  const body = section('RTL and localization QA');
  assert.match(body, /العربية/);
  assert.match(body, /فارسی/);
  assert.match(body, /[ی] و [ک]/u);
  assert.match(body, /dir="rtl"/);
  assert.match(body, /screen reader|keyboard/i);
});

test('V11 provides accessible desktop and mobile illustrations', () => {
  for (const name of ['decision-paths', 'verification-ladder']) {
    assert.ok(existsSync(resolve(root, 'assets', `${name}.svg`)));
    assert.ok(existsSync(resolve(root, 'assets', `${name}-mobile.svg`)));
    assert.match(readme, new RegExp(`<picture>\\s*<source media="\\(max-width: 600px\\)" srcset="\\./assets/${name}-mobile\\.svg" \\/>\\s*<img src="\\./assets/${name}\\.svg" alt="[^"]{40,}"`));
  }
});

test('new sections retain valid internal anchors and local assets', () => {
  assert.deepEqual(auditReadme(readme, {assetExists: path => existsSync(resolve(root, path))}), []);
});

test('new decision and verification sections stay readable on narrow GitHub layouts without fixed multi-column tables', () => {
  for (const heading of ['Decisions in context', 'Verification ladder']) {
    assert.doesNotMatch(section(heading), /^\|(?:[^\n]*\|){2,}$/m,
      `${heading} should use stacked Markdown items rather than a three-column table`);
  }
});
