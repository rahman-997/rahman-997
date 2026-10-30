import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogIssues } from '../scripts/verify-project-catalog.mjs';
const project = (id) => ({id, title:id, focus:'reviewable behavior', category:'engineering', repo:`https://github.com/rahman-997/${id}`, reviewPath:'docs/PROJECT_EVIDENCE_INDEX.md'});
const sample = {schemaVersion:1,projects:['a','b','c','d','e','f'].map(project)};
const docs = {readme:sample.projects.map(x=>x.repo).join(' '),index:sample.projects.map(x=>x.repo).join(' ')};
test('a complete verified catalog has no issues',()=> assert.deepEqual(catalogIssues(sample,docs),[]));
test('duplicate IDs and repositories are rejected',()=> {
  const altered = structuredClone(sample); altered.projects[1].id='a'; altered.projects[1].repo=altered.projects[0].repo;
  assert.match(catalogIssues(altered,docs).join(' '),/Duplicate project id/);
  assert.match(catalogIssues(altered,docs).join(' '),/Duplicate repository/);
});
test('unsafe or unexpected repository origins fail validation',()=> {
  const altered=structuredClone(sample); altered.projects[0].repo='https://evil.example/test';
  assert.match(catalogIssues(altered,docs).join(' '),/Unexpected repository URL/);
});
test('missing README and evidence-index links fail validation',()=> {
  assert.match(catalogIssues(sample,{readme:'',index:''}).join(' '),/Repository not linked/);
});
test('catalog schema and required focus fields are enforced',()=> {
  assert.match(catalogIssues({schemaVersion:2,projects:[]}).join(' '),/Invalid catalog schema/);
  const altered=structuredClone(sample);altered.projects[2].focus='';
  assert.match(catalogIssues(altered,docs).join(' '),/Missing focus/);
});
