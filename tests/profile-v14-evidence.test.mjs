import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditReadme } from '../scripts/profile-audit.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = async path => readFile(resolve(root, path), 'utf8');
const docs = [
  'docs/PROJECT_EVIDENCE_INDEX.md',
  'docs/DEMO_LIMITATIONS.md',
  'docs/PRIVACY_AND_DATA_FLOW.md',
  'docs/RELEASE_AND_RECOVERY.md',
  'docs/COLLABORATION_AND_HANDOFF.md',
];

test('V14 includes a compact evidence hub near the top of the profile', async () => {
  const readme = await read('README.md');
  const before = readme.indexOf('## Selected work');
  const hub = readme.indexOf('## Evidence hub');
  assert.ok(hub > 0 && hub < before);
  assert.match(readme, /\.\/assets\/evidence-compass\.svg/);
  assert.match(readme, /\.\/assets\/evidence-compass-mobile\.svg/);
  for (const doc of docs) assert.ok(readme.includes(`](./${doc})`), `Missing README link to ${doc}`);
  assert.deepEqual(auditReadme(readme, {assetExists:()=>true}), []);
});

test('V14 has substantive guide documents and correctly scoped evidence', async () => {
  for (const doc of docs) {
    const source = await read(doc);
    assert.ok(source.length > 950, `${doc} should contain useful evidence, not just a stub`);
    assert.match(source, /^# /);
    assert.match(source, /https:\/\/github\.com\/rahman-997\//);
    assert.doesNotMatch(source, /\bTODO\b|\bTBD\b|lorem ipsum/i);
  }
  assert.match(await read('docs/DEMO_LIMITATIONS.md'), /not (?:a guarantee|proof)|cannot guarantee/i);
  assert.match(await read('docs/PRIVACY_AND_DATA_FLOW.md'), /Mizan Finance/);
  assert.match(await read('docs/RELEASE_AND_RECOVERY.md'), /rollback/i);
});

test('V14 diagram assets are meaningful and available for small screens', async () => {
  for (const path of ['assets/evidence-compass.svg','assets/evidence-compass-mobile.svg']) {
    assert.ok((await stat(resolve(root,path))).size > 500);
  }
});

test('V14 project catalog covers six unique, verifiable repositories', async () => {
  const data = JSON.parse(await read('data/project-catalog.json'));
  assert.equal(data.schemaVersion, 1);
  assert.equal(data.projects.length, 6);
  const ids = data.projects.map(x=>x.id);
  assert.equal(new Set(ids).size, ids.length);
  for(const project of data.projects) {
    assert.match(project.repo, /^https:\/\/github\.com\/rahman-997\/[a-z0-9-]+$/);
    assert.ok(project.title && project.focus && project.reviewPath);
    assert.match(project.reviewPath, /^docs\/PROJECT_EVIDENCE_INDEX\.md$/);
  }
});

test('V14 review CI includes project catalog validation', async () => {
  const action = await read('.github/workflows/link-health.yml');
  assert.match(action, /node scripts\/verify-project-catalog\.mjs/);
  assert.match(action, /docs\/\*\*/);
  assert.match(action, /data\/\*\*/);
});
