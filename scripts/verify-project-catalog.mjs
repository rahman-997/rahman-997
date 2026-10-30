/** Dependency-free, offline verification for the projects represented in this profile. */
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const profileHost = 'github.com';
const repoPattern = /^https:\/\/github\.com\/rahman-997\/[a-z0-9-]+$/;

export function catalogIssues(data, {readme = '', index = ''} = {}) {
  const errors = [];
  if (!data || typeof data !== 'object' || data.schemaVersion !== 1 || !Array.isArray(data.projects)) {
    return ['Invalid catalog schema or version'];
  }
  const ids = new Set(); const repos = new Set();
  if (data.projects.length !== 6) errors.push(`Expected six curated projects; found ${data.projects.length}`);
  for (const p of data.projects) {
    if (!p || typeof p !== 'object') { errors.push('Malformed project entry'); continue; }
    if (typeof p.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id)) errors.push(`Invalid project id: ${p.id}`);
    if (ids.has(p.id)) errors.push(`Duplicate project id: ${p.id}`);
    ids.add(p.id);
    if (typeof p.repo !== 'string' || !repoPattern.test(p.repo)) errors.push(`Unexpected repository URL: ${p.repo}`);
    if (repos.has(p.repo)) errors.push(`Duplicate repository: ${p.repo}`);
    repos.add(p.repo);
    for (const field of ['title','focus','category']) if (typeof p[field] !== 'string' || !p[field].trim()) errors.push(`Missing ${field}: ${p.id}`);
    if (p.reviewPath !== 'docs/PROJECT_EVIDENCE_INDEX.md') errors.push(`Invalid evidence path: ${p.id}`);
    if (typeof p.repo === 'string' && !readme.includes(p.repo)) errors.push(`Repository not linked in README: ${p.id}`);
    if (typeof p.repo === 'string' && !index.includes(p.repo)) errors.push(`Repository not linked in evidence index: ${p.id}`);
  }
  return errors;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [data, readme, index] = await Promise.all([
    readFile(resolve(root,'data/project-catalog.json'),'utf8').then(JSON.parse),
    readFile(resolve(root,'README.md'),'utf8'),
    readFile(resolve(root,'docs/PROJECT_EVIDENCE_INDEX.md'),'utf8')
  ]);
  const issues = catalogIssues(data, {readme, index});
  if (issues.length) { for(const issue of issues) console.error(issue); process.exitCode=1; }
  else console.log(`OK ${data.projects.length} public project records: unique, correctly linked and traceable`);
}
