import test from 'node:test';
import assert from 'node:assert/strict';
import { guideIssues } from '../scripts/audit-guides.mjs';
const opts = {baseDir: '/repo/docs',projectRoot:'/repo',exists: path => path==='/repo/README.md'};
test('guide audit accepts local navigation to existing repository files',()=>{
  assert.deepEqual(guideIssues('[Back](../README.md) [GitHub](https://github.com/rahman-997)',opts),[]);
});
test('guide audit rejects missing and outside local paths',()=>{
  assert.equal(guideIssues('[bad](../MISSING.md) [out](../../secrets.txt)',opts).length,2);
});
test('guide audit rejects script links and absolute paths',()=>{
  assert.equal(guideIssues('[bad](javascript:alert) [other](/etc/passwd)',opts).length,2);
});
test('guide audit does not treat fenced code link samples as links',()=>{
  assert.deepEqual(guideIssues('```md\n[fake](./absent.md)\n```\n[Back](../README.md)',opts),[]);
});
