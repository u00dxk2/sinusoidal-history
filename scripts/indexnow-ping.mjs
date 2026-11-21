// IndexNow ping for the pages that changed (2026-11-21, the search day).
//
//   node scripts/indexnow-ping.mjs [--dry-run] <url> [<url> ...]
//
// Tells IndexNow-participating engines (Bing and others) that these URLs changed. Run it at a
// close AFTER the deploy is live (check-deployed-sha-drift in-sync), naming only the pages whose
// served content changed in that deploy, never the whole sitemap. It is on the lane's close path,
// not automatic: an automatic post-deploy ping needs a Render deploy hook, which is a Render
// setting (David's).
//
// The key is public by design: IndexNow verifies it by fetching https://<host>/<key>.txt, which
// public/<key>.txt serves. Every URL must be on the canonical host, or the script refuses.
//
// Exit 0 = the API answered 200 or 202 (or --dry-run printed the body); 1 = usage or a refused
// URL; 2 = the API answered anything else (status printed, body never trusted as success).

const HOST = "sinusoidalhistory.com";
const KEY = "9e40c71bb9567c0a86ff0537979c1ac7";
const ENDPOINT = "https://api.indexnow.org/indexnow";

export function buildBody(urls) {
  // Sends the URL as parsed (`href`), never the raw argument: the check and the payload must be
  // the same string, and a raw space would ride into the batch (Codex review 2026-11-21, LOW).
  const urlList = [];
  for (const u of urls) {
    let parsed;
    try {
      parsed = new URL(u);
    } catch {
      throw new Error(`not a URL: ${u}`);
    }
    if (parsed.protocol !== "https:" || parsed.host !== HOST) {
      throw new Error(`refused: ${u} is not on https://${HOST}`);
    }
    urlList.push(parsed.href);
  }
  if (urlList.length === 0) throw new Error("no URLs given");
  return { host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList };
}

async function main(argv) {
  const dry = argv.includes("--dry-run");
  const urls = argv.filter((a) => a !== "--dry-run");
  let body;
  try {
    body = buildBody(urls);
  } catch (e) {
    console.error(`indexnow-ping: ${e.message}`);
    return 1;
  }
  if (dry) {
    console.log(JSON.stringify(body, null, 2));
    return 0;
  }
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
  } catch {
    console.error("indexnow-ping: the request did not complete (network error)");
    return 2;
  }
  console.log(`indexnow-ping: ${urls.length} URL(s) → HTTP ${res.status}`);
  return res.status === 200 || res.status === 202 ? 0 : 2;
}

if (process.argv[1]?.endsWith("indexnow-ping.mjs")) {
  main(process.argv.slice(2)).then((code) => process.exit(code));
}
