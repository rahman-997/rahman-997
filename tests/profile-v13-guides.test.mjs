import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditReadme } from '../scripts/profile-audit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = async path => readFile(resolve(root, path), 'utf8');
const readme = await read('README.md');
const guides = [
  'docs/REVIEWER_START_HERE.md',
  'docs/PROJECT_FIELD_GUIDES.md',
  'docs/ARCHITECTURE_DECISIONS.md',
  'docs/QUALITY_AND_SECURITY.md',
  'docs/RTL_AND_ACCESSIBILITY.md',
];

test('V13 presents a compact review route before the selected projects', () => {
  const start = readme.indexOf('## Review in 10 minutes');
  assert.ok(start > 0, 'missing reviewer path');
  assert.ok(start < readme.indexOf('## Selected work'), 'reviewer path must be easy to find');
  assert.match(readme, /\[Reviewers: start here\]\(\.\/docs\/REVIEWER_START_HERE\.md\)/);
});

test('V13 includes a linked technical field guide without bloating the hero', async () => {
  assert.ok(readme.includes('## Engineering field guides'));
  for (const path of guides) assert.ok(readme.includes(`](./${path})`), `Missing guide link ${path}`);
  assert.ok(readme.includes('./assets/field-guide.svg'));
  assert.ok(readme.includes('./assets/field-guide-mobile.svg'));
  assert.ok((await stat(resolve(root, 'assets/field-guide-mobile.svg'))).size > 200);
});

test('V13 guides are standalone, substantive, and traceable to source', async () => {
  for (const path of guides) {
    const text = await read(path);
    assert.ok(text.length > 900, `${path} is too thin`);
    assert.match(text, /^# [^\n]+/);
    assert.match(text, /https:\/\/github\.com\/rahman-997\//);
    assert.doesNotMatch(text, /\bTODO\b|\bTBD\b|\blorem ipsum\b/i);
  }
});

test('V13 documentation distinguishes models and recommendations from production claims', async () => {
  const architecture = await read('docs/ARCHITECTURE_DECISIONS.md');
  const quality = await read('docs/QUALITY_AND_SECURITY.md');
  assert.match(architecture, /trade-off|tradeoff/i);
  assert.match(architecture, /not a claim|illustrative|example/i);
  assert.match(quality, /does not guarantee|not a guarantee|not proof/i);
  assert.match(quality, /CI|workflow/);
});

test('V13 multilingual QA preserves real Arabic/Persian examples and correct Persian letters', async () => {
  const guide = await read('docs/RTL_AND_ACCESSIBILITY.md');
  assert.match(guide, /العربية/);
  assert.match(guide, /فارسی/);
  assert.match(guide, /[ی]/);
  assert.match(guide, /[ک]/);
  assert.match(guide, /keyboard/i);
});

test('V13 new diagram is meaningful and included in README audit', async () => {
  const s = await stat(resolve(root, 'assets/field-guide.svg'));
  assert.ok(s.size > 200);
  assert.deepEqual(auditReadme(readme, {assetExists: p => true}), []);
});
