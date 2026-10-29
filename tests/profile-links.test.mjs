import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { extractExternalLinks, shouldMonitorLink, checkLink, checkAll } from '../scripts/profile-links.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('extracts distinct Markdown and HTML destination links, excluding images and local anchors', () => {
  const markdown = `
[Portfolio](https://example.com/portfolio)
![Badge](https://example.com/badge.svg)
<a href="https://example.com/contact?via=profile">Contact</a>
<a rel='noopener' href='https://example.com/portfolio'>Again</a>
[Local](#projects)
[Email](mailto:test@example.com)
`;
  assert.deepEqual(extractExternalLinks(markdown), [
    'https://example.com/portfolio',
    'https://example.com/contact?via=profile',
  ]);
});

test('does not treat commented-out or fenced Markdown links as live destinations', () => {
  const markdown = `<!-- [Old](https://old.example) -->\n\`\`\`md\n[Sample](https://sample.example)\n\`\`\`\n[Live](https://live.example)`;
  assert.deepEqual(extractExternalLinks(markdown), ['https://live.example']);
});

test('retries temporary HTTP errors and eventually succeeds', async () => {
  const seen = [];
  const fetchImpl = async (_url) => ({ status: [503, 429, 200][seen.push(1) - 1] });
  const result = await checkLink('https://example.com', { fetchImpl, attempts: 3, wait: async () => {}, timeoutMs: 100 });
  assert.equal(result.ok, true);
  assert.equal(result.attempts, 3);
  assert.equal(seen.length, 3);
});

test('fails fast for permanent HTTP 404 errors after verifying with GET', async () => {
  let calls = 0;
  const result = await checkLink('https://example.com/not-found', {
    fetchImpl: async () => { calls++; return { status: 404 }; },
    attempts: 3,
    wait: async () => {},
  });
  assert.equal(result.ok, false);
  assert.match(result.error, /HTTP 404/);
  assert.equal(calls, 2); // HEAD followed by GET; no additional retries.
});

test('checks all links with a bounded concurrency and preserves result order', async () => {
  let active = 0;
  let maximum = 0;
  const urls = Array.from({ length: 11 }, (_, i) => `https://example.com/${i}`);
  const results = await checkAll(urls, {
    concurrency: 3,
    check: async (url) => {
      active++;
      maximum = Math.max(maximum, active);
      await new Promise(resolve => setTimeout(resolve, 1));
      active--;
      return { url, ok: true, status: 200 };
    },
  });
  assert.equal(maximum, 3);
  assert.deepEqual(results.map((result) => result.url), urls);
});

test('the profile README includes actionable links and a local hero illustration', async () => {
  const readme = await readFile(resolve(root, 'README.md'), 'utf8');
  const links = extractExternalLinks(readme);
  assert.ok(links.length >= 10);
  assert.match(readme, /assets\/hero\.svg/);
  assert.match(readme, /alt="[^"]+"/);
  assert.equal(links.length, new Set(links).size);
});


test('social destinations that block automated agents are not used as CI uptime probes', () => {
  assert.equal(shouldMonitorLink('https://www.linkedin.com/in/example'), false);
  assert.equal(shouldMonitorLink('https://github.com/rahman-997/eventify'), true);
  assert.equal(shouldMonitorLink('https://example.com/project'), true);
});

test('every local image referenced by README exists in the repository', async () => {
  const readme = await readFile(resolve(root, 'README.md'), 'utf8');
  const images = [...readme.matchAll(/<img\b[^>]*?\bsrc="(\.\/assets\/[^"]+)"/g)];
  assert.ok(images.length >= 9);
  for (const [, file] of images) await access(resolve(root, file));
});

test('an empty destination list is supported by the concurrency limiter', async () => {
  assert.deepEqual(await checkAll([]), []);
});

test('ignores example links inside inline code, indented fences, and HTML code blocks', () => {
  const markdown = `
Real: [Work](https://example.com/work)
Inline: \`[not a link](https://example.com/inline)\`
  ~~~~md
[not a link](https://example.com/fenced)
  ~~~~
<pre><a href="https://example.com/pre">Example</a></pre>
<code>[not a link](https://example.com/html-code)</code>
`;
  assert.deepEqual(extractExternalLinks(markdown), ['https://example.com/work']);
});

test('checks with HEAD first to avoid downloading entire pages', async () => {
  const methods = [];
  const result = await checkLink('https://example.com/large-page', {
    fetchImpl: async (_url, options) => {
      methods.push(options.method);
      return { status: 200 };
    },
    wait: async () => {},
  });
  assert.equal(result.ok, true);
  assert.deepEqual(methods, ['HEAD']);
});

test('falls back to GET if HEAD is unsupported by the destination', async () => {
  const methods = [];
  const result = await checkLink('https://example.com/head-not-allowed', {
    fetchImpl: async (_url, options) => {
      methods.push(options.method);
      return { status: options.method === 'HEAD' ? 405 : 200 };
    },
    wait: async () => {},
  });
  assert.equal(result.ok, true);
  assert.equal(result.attempts, 1);
  assert.deepEqual(methods, ['HEAD', 'GET']);
});

test('GET fallbacks close their response stream instead of downloading content', async () => {
  let cancelled = 0;
  const result = await checkLink('https://example.com/large-page', {
    fetchImpl: async (_url, options) => ({
      status: options.method === 'HEAD' ? 501 : 200,
      body: { cancel: async () => { cancelled++; } },
    }),
    wait: async () => {},
  });
  assert.equal(result.ok, true);
  assert.equal(cancelled, 2);
});

test('uses a strict host check when skipping LinkedIn robots', () => {
  assert.equal(shouldMonitorLink('https://business.linkedin.com'), false);
  assert.equal(shouldMonitorLink('https://notlinkedin.com'), true);
});

test('README has quick navigation for the main sections without external requests', async () => {
  const readme = await readFile(resolve(root, 'README.md'), 'utf8');
  for (const anchor of ['about-my-work', 'selected-work', 'engineering-toolkit', 'lets-connect']) {
    assert.ok(readme.includes(`href="#${anchor}"`), `Missing quick navigation to ${anchor}`);
  }
});


test('responsive profile hero has a mobile image and a desktop fallback', async () => {
  const readme = await readFile(resolve(root, 'README.md'), 'utf8');
  assert.match(readme, /<picture>[\s\S]*?<source\s+media="\(max-width: 600px\)"\s+srcset="\.\/assets\/hero-mobile\.svg"[\s\S]*?<img\s+src="\.\/assets\/hero\.svg"/);
  await access(resolve(root, 'assets/hero-mobile.svg'));
});

test('external uptime probes do not run on profile README changes or pull requests', async () => {
  const workflow = await readFile(resolve(root, '.github/workflows/link-health.yml'), 'utf8');
  assert.match(workflow, /verify-public-links:[\s\S]*?if:.*github\.event_name == 'schedule'.*github\.event_name == 'workflow_dispatch'/);
  assert.match(workflow, /quality:[\s\S]*?node --test tests\/\*\.test\.mjs/);
  const qualityBlock = workflow.split('verify-public-links:')[0];
  assert.doesNotMatch(qualityBlock, /run: node scripts\/check-profile-links\.mjs(?! --list)/);
});


test('HEAD 404 must fall back to GET before classifying a URL as missing', async () => {
  const methods = [];
  const result = await checkLink('https://example.com/working-get-only', {
    fetchImpl: async (_url, options) => {
      methods.push(options.method);
      return { status: options.method === 'HEAD' ? 404 : 200 };
    },
    wait: async () => {},
  });
  assert.equal(result.ok, true);
  assert.deepEqual(methods, ['HEAD', 'GET']);
});

test('missing URLs are not retried when HEAD and GET both return 404', async () => {
  const methods = [];
  const result = await checkLink('https://example.com/missing', {
    fetchImpl: async (_url, options) => { methods.push(options.method); return { status: 404 }; },
    attempts: 3, wait: async () => {},
  });
  assert.equal(result.ok, false);
  assert.equal(result.attempts, 1);
  assert.deepEqual(methods, ['HEAD', 'GET']);
});

test('project cards are stacked for small screens, and responsive images all exist', async () => {
  const readme = await readFile(resolve(root, 'README.md'), 'utf8');
  const section = readme.split('## Selected work')[1].split('## Engineering toolkit')[0];
  assert.doesNotMatch(section, /<table\b/i, 'Two-column GitHub tables do not collapse on mobile');
  for (const name of ['eventify', 'bookhaven', 'fitflow', 'mizan', 'venues', 'portfolio']) {
    assert.match(section, new RegExp(`assets/${name}\\.svg`));
  }
  const assetPaths = [
    ...[...readme.matchAll(/<img\b[^>]*?\bsrc="(\.\/assets\/[^"]+)"/g)].map(m => m[1]),
    ...[...readme.matchAll(/<source\b[^>]*?\bsrcset="(\.\/assets\/[^"]+)"/g)].map(m => m[1]),
  ];
  assert.ok(new Set(assetPaths).size >= 10);
  for (const path of assetPaths) await access(resolve(root, path));
});


test('extracts navigable badge links around Markdown images without monitoring the badge image', () => {
  const markdown = '[![Build status](https://img.example.com/badge.svg)](https://github.com/rahman-997/portfolio/actions)';
  assert.deepEqual(extractExternalLinks(markdown), ['https://github.com/rahman-997/portfolio/actions']);
});

test('extracts destination URLs containing balanced parentheses and a Markdown title', () => {
  const markdown = '[Docs](https://example.com/wiki/Functions_(computing) "Overview")';
  assert.deepEqual(extractExternalLinks(markdown), ['https://example.com/wiki/Functions_(computing)']);
});

test('ignores image-only links while keeping adjacent actual destinations', () => {
  const markdown = '![Screenshot](https://images.example.com/preview.png) [Open](https://example.com/app)';
  assert.deepEqual(extractExternalLinks(markdown), ['https://example.com/app']);
});
