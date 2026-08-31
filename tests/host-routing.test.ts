import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeHostname,
  resolveSiteSlug,
  sitePathname,
} from "../lib/host-routing.ts";

test("normalizes host headers before routing", () => {
  assert.equal(normalizeHostname("Apple.Localhost:3000"), "apple.localhost");
  assert.equal(normalizeHostname("atlas.example.com."), "atlas.example.com");
});

test("resolves one valid subdomain label", () => {
  assert.equal(resolveSiteSlug("apple.localhost:3000"), "apple");
  assert.equal(resolveSiteSlug("linear.example.com", "example.com"), "linear");
});

test("keeps root, www, and nested hosts on the hub", () => {
  assert.equal(resolveSiteSlug("localhost:3000"), null);
  assert.equal(resolveSiteSlug("www.example.com", "example.com"), null);
  assert.equal(resolveSiteSlug("deep.apple.example.com", "example.com"), null);
});

test("maps a resolved subdomain to the internal fallback route", () => {
  assert.equal(sitePathname("apple", "/"), "/sites/apple");
  assert.equal(sitePathname("apple", "/about"), "/sites/apple/about");
});
