#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { extractExternalLinks, shouldMonitorLink, checkAll } from './profile-links.mjs';

const usage = `Usage: node scripts/check-profile-links.mjs [--list | --help]

  --list    Show unique navigable public links without network requests.
  --help    Show this help.

The URL list comes directly from README.md (not a duplicated hardcoded list).`;

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log(usage);
} else if (args.some((arg) => arg !== '--list')) {
  console.error(usage);
  process.exitCode = 2;
} else {
  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  const links = extractExternalLinks(readme);

  if (links.length === 0) {
    console.error('No public navigation links found in README.md.');
    process.exitCode = 1;
  } else if (args.includes('--list')) {
    console.log(`${links.length} unique external destination(s):\n${links.join('\n')}`);
  } else {
    console.log(`Found ${links.length} destinations. Checking eligible links with at most 4 parallel requests…\n`);
    const monitored = links.filter(shouldMonitorLink);
    const skipped = links.filter((url) => !shouldMonitorLink(url));
    for (const url of skipped) console.log(`SKIP (automated checks blocked) ${url}`);
    const results = await checkAll(monitored);
    for (const result of results) {
      console.log(`${result.ok ? 'OK  ' : 'FAIL'} ${String(result.status ?? result.error).padEnd(24)} ${result.url}`);
    }
    const failures = results.filter((result) => !result.ok);
    console.log(`\n${results.length - failures.length}/${results.length} monitored destinations are reachable. ${skipped.length} destination(s) skipped.`);
    if (failures.length) process.exitCode = 1;
  }
}
