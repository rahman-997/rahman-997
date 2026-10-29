import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { auditReadme } from '../scripts/profile-audit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const valid = `# Profile

[Jump](#selected-work)
## Selected work
<img src="./assets/card.svg" alt="Project preview" width="500" />
<picture><source media="(max-width: 600px)" srcset="./assets/mobile.svg"/><img src="./assets/wide.svg" alt="Profile banner" /></picture>
`;

test('accepts usable internal navigation and labelled local images', () => {
  assert.deepEqual(auditReadme(valid, { assetExists: path => ['assets/card.svg','assets/mobile.svg','assets/wide.svg'].includes(path) }), []);
});

test('reports an internal navigation target not present in README headings', () => {
  const issues = auditReadme('[Go](#nonexistent)\n## Selected work');
  assert.ok(issues.some(issue => issue.includes('#nonexistent')));
});

test('detects missing image alt text and missing mobile asset', () => {
  const issues = auditReadme('<img src="./assets/wide.svg" />\n<source srcset="./assets/missing.svg" />', {
    assetExists: path => path === 'assets/wide.svg',
  });
  assert.ok(issues.some(issue => issue.includes('alt')));
  assert.ok(issues.some(issue => issue.includes('assets/missing.svg')));
});

test('blocks relative asset references that escape the repository root', () => {
  const issues = auditReadme('<img src="../../private.svg" alt="Outside" />', {assetExists: () => true});
  assert.ok(issues.some(issue => issue.includes('outside repository')));
});

test('audits the current README with all assets present', async () => {
  const markdown = await readFile(resolve(root, 'README.md'), 'utf8');
  assert.deepEqual(auditReadme(markdown, { assetExists: path => existsSync(resolve(root, path)) }), []);
});

test('CI invokes the offline profile audit for every README or script change', async () => {
  const workflow = await readFile(resolve(root, '.github/workflows/link-health.yml'), 'utf8');
  assert.match(workflow, /node scripts\/profile-audit\.mjs/);
  assert.match(workflow, /scripts\/\*\*/);
});

test('repeated headings get GitHub-style numerical navigation suffixes', () => {
  const markdown = '# Intro\n## Details\n## Details\n[Second](#details-1)';
  assert.deepEqual(auditReadme(markdown), []);
});

test('rejects unsafe HTML link protocols rather than rendering them as navigation', () => {
  const issues = auditReadme('<a href="javascript:alert(1)">click</a>\n<a href="data:text/html,a">more</a>');
  assert.ok(issues.some(issue => issue.includes('javascript:')));
  assert.ok(issues.some(issue => issue.includes('data:')));
});

test('rejects unsafe Markdown URL schemes while preserving regular https links', () => {
  const issues = auditReadme('[unsafe](vbscript:msgbox(1))\n[ok](https://example.org)');
  assert.ok(issues.some(issue => issue.includes('vbscript:')));
  assert.ok(!issues.some(issue => issue.includes('https://example.org')));
});

test('identifies missing relative document links rather than only missing image assets', () => {
  const issues = auditReadme('[Guide](./does-not-exist.md)', {assetExists: () => false});
  assert.ok(issues.some(issue => issue.includes('Missing local link')));
});

test('accepts existing local documents, anchors, and externally hosted URLs', () => {
  const text = '[Guide](./CONTRIBUTING.md) · [top](#profile) · [web](https://example.com)\n# Profile';
  assert.deepEqual(auditReadme(text, {assetExists: path => path === 'CONTRIBUTING.md'}), []);
});

test('rejects traversal outside repository for relative documents', () => {
  const issues = auditReadme('[secret](../../secret.md)', {assetExists: () => true});
  assert.ok(issues.some(issue => issue.includes('outside repository')));
});
