/** Utilities for validating the external destinations linked from README.md. */

/** LinkedIn deliberately rejects automated uptime probes (often 999/403). */
export function shouldMonitorLink(url) {
  const hostname = new URL(url).hostname.toLowerCase();
  return hostname !== 'linkedin.com' && !hostname.endsWith('.linkedin.com');
}

const defaultWait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Read only navigable links. External images, code examples, HTML comments,
 * local anchors and mailto links are intentionally ignored.
 */
export function extractExternalLinks(markdown) {
  // Links inside code and HTML comments are examples, not destinations.
  // Track fences line-by-line because Markdown permits indentation and both
  // backtick and tilde fences of arbitrary length.
  const withoutComments = markdown
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<pre\b[^>]*>[\s\S]*?<\/pre\s*>/gi, '')
    .replace(/<code\b[^>]*>[\s\S]*?<\/code\s*>/gi, '');
  let fence = null;
  const outsideFences = withoutComments.split(/\r?\n/).map((line) => {
    const candidate = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (candidate && candidate[1][0] === fence.char &&
          candidate[1].length >= fence.length && !candidate[2].trim()) {
        fence = null;
      }
      return '';
    }
    if (candidate) {
      fence = { char: candidate[1][0], length: candidate[1].length };
      return '';
    }
    return line;
  }).join('\n');
  // Strip backtick code spans, including those with multi-backtick delimiters.
  const content = outsideFences.replace(/(?<!`)(`+)(?!`)[\s\S]*?\1(?!`)/g, '');

  const hits = [];
  // Resolve Markdown destinations by matching delimiters instead of a URL regex.
  // In particular, [![status](badge.svg)](destination) should probe the
  // destination, not the embedded badge image, and URLs may include parentheses.
  for (let index = 0; index < content.length; index++) {
    if (content[index] !== '[' || content[index - 1] === '!' || content[index - 1] === '\\') continue;
    let brackets = 1;
    let labelEnd = index + 1;
    for (; labelEnd < content.length && brackets > 0; labelEnd++) {
      if (content[labelEnd] === '\n') break;
      if (content[labelEnd] === '[' && content[labelEnd - 1] !== '\\') brackets++;
      else if (content[labelEnd] === ']' && content[labelEnd - 1] !== '\\') brackets--;
    }
    if (brackets !== 0 || content[labelEnd] !== '(') continue;
    const start = labelEnd + 1;
    if (!content.startsWith('https://', start) && !content.startsWith('http://', start)) continue;

    let cursor = start;
    let parentheses = 0;
    for (; cursor < content.length; cursor++) {
      const char = content[cursor];
      if (char === '\n') break;
      if (char === '(') parentheses++;
      else if (char === ')') {
        if (parentheses === 0) break;
        parentheses--;
      } else if (/\s/.test(char) && parentheses === 0) break;
    }
    if (parentheses !== 0) continue;
    const url = content.slice(start, cursor);
    let close = cursor;
    if (/\s/.test(content[close] ?? '')) {
      while (content[close] === ' ' || content[close] === '\t') close++;
      const quote = content[close];
      if (quote !== '"' && quote !== "'") continue;
      close++;
      while (close < content.length && content[close] !== quote && content[close] !== '\n') close++;
      if (content[close] !== quote) continue;
      close++;
      while (content[close] === ' ' || content[close] === '\t') close++;
    }
    if (content[close] === ')') hits.push({ index, url });
  }

  // GitHub README cards use HTML anchors around local SVG previews.
  const anchor = /<a\b[^>]*?\bhref\s*=\s*(['"])(https?:\/\/[^'"<>\s]+)\1[^>]*>/gi;
  for (const match of content.matchAll(anchor)) {
    hits.push({ index: match.index, url: match[2] });
  }

  hits.sort((a, b) => a.index - b.index);
  return [...new Set(hits.map((hit) => hit.url.replace(/&amp;/g, '&')))];
}

/** Retry timeouts, network failures and transient status codes, not 4xx. */
export async function checkLink(url, {
  fetchImpl = fetch,
  attempts = 2,
  timeoutMs = 25_000,
  wait = defaultWait,
  retryDelayMs = 1_200,
} = {}) {
  let lastError = 'Unknown failure';

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let retryable = true;

    try {
      // HEAD is much cheaper for active websites. Some services reject it, so
      // only those destinations receive a GET fallback (including HEAD-only 404s).
      let response;
      const request = (method) => fetchImpl(url, {
        method,
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'user-agent': 'rahman-997-profile-link-health/3.0' },
      });
      response = await request('HEAD');
      if ([400, 403, 404, 405, 501].includes(response.status)) {
        await response.body?.cancel?.();
        response = await request('GET');
      }
      const status = response.status;
      // Closing the stream also avoids downloading big responses from hosts
      // that require GET for link checks.
      await response.body?.cancel?.();
      if (status >= 200 && status < 400) {
        return { url, ok: true, status, attempts: attempt };
      }
      lastError = `HTTP ${status}`;
      retryable = status === 408 || status === 429 || status >= 500;
    } catch (error) {
      lastError = controller.signal.aborted
        ? `Timed out after ${timeoutMs}ms`
        : (error?.message ?? String(error));
    } finally {
      clearTimeout(timeout);
    }

    if (!retryable || attempt === attempts) {
      return { url, ok: false, error: lastError, attempts: attempt };
    }
    await wait(retryDelayMs * attempt);
  }
  return { url, ok: false, error: lastError, attempts };
}

/** Run at most `concurrency` checks simultaneously. Result order is stable. */
export async function checkAll(urls, { concurrency = 4, check = checkLink } = {}) {
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new RangeError('concurrency must be a positive integer');
  }
  const results = Array(urls.length);
  let cursor = 0;

  async function worker() {
    while (cursor < urls.length) {
      const index = cursor++;
      results[index] = await check(urls[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, worker));
  return results;
}
