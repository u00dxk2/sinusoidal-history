#!/usr/bin/env node
// Read-only: prints the Render auto-deploy trigger for this site's web service (I-026).
// Prints the service name, autoDeploy and autoDeployTrigger only — never the key, never
// a response body. Every failure prints a fixed string.
//
//   node scripts/read-render-deploy-trigger.mjs
//
// Exit 0 when the trigger is `checksPass` (I-026 closed), 3 when it is anything else,
// 2 when the read failed. Sets process.exitCode rather than calling process.exit():
// exiting while fetch's keep-alive socket closes trips a libuv assertion on Windows
// (measured 2026-10-04: exit 127 instead of 3).

const SERVICE = "srv-d7mcat7lk1mc73bidim0"; // sinusoidal-history (docs/daily-config.md)

async function main() {
  if (!process.env.RENDER_API_KEY) {
    console.log("read-render-deploy-trigger: RENDER_API_KEY not in this process's environment");
    return 2;
  }
  const res = await fetch(`https://api.render.com/v1/services/${SERVICE}`, {
    headers: { Authorization: `Bearer ${process.env.RENDER_API_KEY}` },
  });
  if (res.status !== 200) {
    console.log(`read-render-deploy-trigger: service read failed (HTTP ${res.status})`);
    return 2;
  }
  const s = await res.json();
  const trigger = String(s.autoDeployTrigger ?? "absent");
  console.log(`${SERVICE}: name ${s.name}, autoDeploy ${s.autoDeploy}, autoDeployTrigger ${trigger}`);
  const closed = trigger === "checksPass";
  console.log(closed ? "RESULT: checksPass — I-026 can close" : "RESULT: not checksPass — I-026 stays open");
  return closed ? 0 : 3;
}

try {
  process.exitCode = await main();
} catch {
  console.log("read-render-deploy-trigger: unexpected error (details withheld)");
  process.exitCode = 2;
}
