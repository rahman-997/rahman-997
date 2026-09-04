const targets = [
  ["Portfolio", "https://abdulrahman-hajar-portfolio.onrender.com"],
  ["Résumé", "https://abdulrahman-hajar-portfolio.onrender.com/resume/"],
  ["Eventify live", "https://eventify-web.onrender.com"],
  ["Eventify source", "https://github.com/rahman-997/eventify"],
  ["Eventify case study", "https://abdulrahman-hajar-portfolio.onrender.com/work/eventify/"],
  ["BookHaven live", "https://bookbookhaven-free.onrender.com"],
  ["BookHaven source", "https://github.com/rahman-997/bookbookhaven"],
  ["BookHaven case study", "https://abdulrahman-hajar-portfolio.onrender.com/work/bookhaven/"],
  ["FitFlow live", "https://fitflow-gym-online.netlify.app"],
  ["FitFlow source", "https://github.com/rahman-997/fitflow-gym"],
  ["FitFlow case study", "https://abdulrahman-hajar-portfolio.onrender.com/work/fitflow/"],
  ["Venues API health", "https://venues-api-rahman.onrender.com/health"],
  ["Venues API source", "https://github.com/rahman-997/venues-api"],
  ["Venues API case study", "https://abdulrahman-hajar-portfolio.onrender.com/work/venues-api/"],
  ["Mizan source", "https://github.com/rahman-997/mizan-finance"],
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const maxAttempts = 3;
const timeoutMs = 45_000;

async function check(name, url) {
  let lastFailure = "unknown failure";

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "rahman-997-profile-link-health" },
      });

      if (response.status >= 200 && response.status < 400) {
        console.log(`OK   ${name.padEnd(20)} ${response.status} ${url}`);
        return null;
      }

      lastFailure = `HTTP ${response.status}`;
      if (response.status < 500 && response.status !== 429) break;
    } catch (error) {
      lastFailure = error?.name === "AbortError" ? `timeout after ${timeoutMs}ms` : String(error);
    } finally {
      clearTimeout(timeout);
    }

    if (attempt < maxAttempts) await sleep(7_500 * attempt);
  }

  return `${name}: ${lastFailure} — ${url}`;
}

const results = await Promise.all(targets.map(([name, url]) => check(name, url)));
const failures = results.filter(Boolean);

if (failures.length) {
  console.error("\nProfile link health failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`\nProfile link health passed for ${targets.length} critical public links.`);
