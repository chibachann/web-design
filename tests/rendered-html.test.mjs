import assert from "node:assert/strict";
import test from "node:test";

/** Renders the built Worker response for a requested URL. */
async function render(url = "http://localhost/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(url, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the foundation hub", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Design Atlas<\/title>/i);
  assert.match(html, /One idea\./);
  assert.match(html, /Quiet Product/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("serves a registered site through its path fallback", async () => {
  const response = await render("http://localhost/sites/apple");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Quiet Product/);
  assert.match(html, /Foundation preview/);
});

test("returns a 404 for an unknown site path", async () => {
  const response = await render("http://localhost/sites/not-registered");
  assert.equal(response.status, 404);
});
