import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditReadme } from '../scripts/profile-audit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readme = await readFile(resolve(root, 'README.md'), 'utf8');
const sections = [
  ['User journeys and interface states', 'user-journeys-and-interface-states'],
  ['Data ownership and privacy', 'data-ownership-and-privacy'],
  ['Observability and service signals', 'observability-and-service-signals'],
  ['Developer experience and reproducibility', 'developer-experience-and-reproducibility'],
  ['Evidence and verification map', 'evidence-and-verification-map'],
];

function section(title) {
  const marker = `## ${title}`;
  const start = readme.indexOf(marker);
  assert.ok(start >= 0, `Missing heading: ${title}`);
  const next = readme.indexOf('\n## ', start + marker.length);
  return readme.slice(start, next < 0 ? undefined : next);
}

test('V10 adds five substantive sections reachable through GitHub-compatible navigation', () => {
  for (const [title, anchor] of sections) {
    const body = section(title);
    assert.ok(body.length > 340, `${title} needs real substance`);
    assert.ok(readme.includes(`href="#${anchor}"`), `Missing anchor ${anchor}`);
  }
});

test('V10 keeps important destinations visible and puts specialist links in a native details menu', () => {
  const top = readme.slice(0, readme.indexOf('## About my work'));
  assert.match(top, /<details>\s*<summary>Explore more topics<\/summary>/);
  for (const anchor of ['#about-my-work', '#selected-work', '#lets-connect']) {
    assert.ok(top.includes(`href="${anchor}"`), `Missing prominent link ${anchor}`);
  }
});

test('V10 includes informative, locally editable diagrams with accessible alternatives', () => {
  for (const file of ['user-journeys.svg', 'service-signals.svg']) {
    assert.ok(existsSync(resolve(root, 'assets', file)), `Missing diagram ${file}`);
    assert.match(readme, new RegExp(`<img[^>]+src="\\./assets/${file}"[^>]+alt="[^"]{40,}"`));
  }
});

test('new sections connect principles to concrete public code and distinguish guidance from claims', () => {
  assert.match(section('User journeys and interface states'), /fitflow-gym/);
  assert.match(section('Data ownership and privacy'), /mizan-finance/);
  assert.match(section('Observability and service signals'), /eventify/);
  assert.match(section('Developer experience and reproducibility'), /node --test tests\/\*\.test\.mjs/);
  assert.match(section('Evidence and verification map'), /workflow|test|source/i);
  assert.match(section('Evidence and verification map'), /not a guarantee|not proof/i);
});

test('V10 keeps all navigation and local images valid', () => {
  assert.deepEqual(auditReadme(readme, { assetExists: path => existsSync(resolve(root, path)) }), []);
});

test('new detailed diagrams provide mobile-first alternatives in responsive picture elements', () => {
  for (const base of ['user-journeys', 'service-signals']) {
    assert.ok(existsSync(resolve(root, 'assets', `${base}-mobile.svg`)), `Missing ${base} mobile drawing`);
    assert.match(readme, new RegExp(`<picture>\\s*<source media="\\(max-width: 600px\\)" srcset="\\./assets/${base}-mobile.svg" \\/>\\s*<img src="\\./assets/${base}.svg"`));
  }
});
