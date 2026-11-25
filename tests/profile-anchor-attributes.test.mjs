import test from 'node:test';
import assert from 'node:assert/strict';
import { extractExternalLinks } from '../scripts/profile-links.mjs';

test('ignores data-href while finding the real href', () => {
  assert.deepEqual(extractExternalLinks('<a data-href="https://example.test/placeholder" href="https://example.test/live">Open</a>'), ['https://example.test/live']);
});

test('ignores href-like text inside quoted attributes', () => {
  assert.deepEqual(extractExternalLinks(`<a title='href="https://example.test/fake"' href="https://example.test/live">Open</a>`), ['https://example.test/live']);
});

test('does not interpret a custom a-prefixed element as an anchor', () => {
  assert.deepEqual(extractExternalLinks('<a-card href="https://example.test/fake">Card</a-card>'), []);
});

test('allows greater-than characters inside quoted titles', () => {
  assert.deepEqual(extractExternalLinks('<a title="2 > 1" href="https://example.test/live">Open</a>'), ['https://example.test/live']);
});

test('preserves order, case-insensitive attributes, deduplication and entity decoding', () => {
  const markdown = `[First](https://example.test/first)\n<A HREF='https://example.test/live?a=1&amp;b=2'><img src="https://example.test/image.svg"></A>\n[Again](https://example.test/live?a=1&b=2)`;
  assert.deepEqual(extractExternalLinks(markdown), ['https://example.test/first', 'https://example.test/live?a=1&b=2']);
});

test('uses the first href when duplicate attributes are present', () => {
  assert.deepEqual(extractExternalLinks('<a href="#local" href="https://example.test/fake">Local</a>'), []);
});
