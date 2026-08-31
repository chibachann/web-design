export type StyleStatus = "planned" | "building" | "review" | "live";

export interface StyleRecord {
  slug: string;
  displayName: string;
  sourceName: string;
  sourceUrl: string;
  originalUrl: string;
  category: string;
  theme: "light" | "dark" | "mixed";
  description: string;
  status: StyleStatus;
  updatedAt: string;
}

export const styleRecords = [
  {
    slug: "apple",
    displayName: "Quiet Product",
    sourceName: "Apple",
    sourceUrl:
      "https://styles.refero.design/style/aecac5da-f397-4ddf-b71f-de1efc434cb8",
    originalUrl: "https://www.apple.com/",
    category: "Minimal product",
    theme: "light",
    description:
      "A restrained product story built with near-white surfaces, precise typography, and one deliberate blue action.",
    status: "building",
    updatedAt: "2026-09-01",
  },
  {
    slug: "linear",
    displayName: "Night Signal",
    sourceName: "Linear",
    sourceUrl:
      "https://styles.refero.design/style/90ce5883-bb24-4466-93f7-801cd617b0d1",
    originalUrl: "https://linear.app/",
    category: "Dark SaaS",
    theme: "dark",
    description:
      "A precision workspace shaped by dark layers, quiet gradients, and compact product storytelling.",
    status: "planned",
    updatedAt: "2026-09-01",
  },
  {
    slug: "miranda",
    displayName: "The Daily Form",
    sourceName: "Miranda",
    sourceUrl:
      "https://styles.refero.design/style/3f6e3076-e77f-487e-b212-3b5946a34e87",
    originalUrl: "https://niccolomiranda.com/",
    category: "Editorial",
    theme: "light",
    description:
      "An old-world editorial composition with warm paper, dense type, and expressive column rhythm.",
    status: "planned",
    updatedAt: "2026-09-01",
  },
  {
    slug: "slush",
    displayName: "Soft Collision",
    sourceName: "Slush",
    sourceUrl:
      "https://styles.refero.design/style/8b6b547f-a357-4f1b-9842-4579c62dd42b",
    originalUrl: "https://slush.app/",
    category: "Playful product",
    theme: "mixed",
    description:
      "A bright, tactile interface made from oversized shapes, sticker energy, and playful motion cues.",
    status: "planned",
    updatedAt: "2026-09-01",
  },
] as const satisfies readonly StyleRecord[];

export type StyleSlug = (typeof styleRecords)[number]["slug"];

/** Returns the registered style entry for a stable site slug. */
export function getStyleRecord(slug: string): StyleRecord | undefined {
  return styleRecords.find((style) => style.slug === slug);
}

/** Narrows an arbitrary hostname segment to a registered style slug. */
export function isStyleSlug(slug: string): slug is StyleSlug {
  return styleRecords.some((style) => style.slug === slug);
}
