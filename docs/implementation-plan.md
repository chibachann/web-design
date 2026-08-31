# Design Hub implementation plan

## Goal

Build a hub that catalogs complete, original demo sites derived from the public design-system guidance on Refero Styles. Each demo is reachable both through the hub and through its own subdomain.

The implementation will reproduce a design language (palette, typography, spacing, layout rhythm, component behavior), not copy a brand's proprietary source code, logos, product copy, or protected imagery. Every demo will use original content and appropriately licensed or generated assets.

## What the reference site provides

Refero Styles is a searchable catalog of more than 2,000 design-system references. The catalog exposes:

- style cards with a preview image, brand/source name, and short visual description;
- search and style filters such as minimal, editorial, gradients, monochrome, playful, high contrast, and premium;
- sorting by trending, popular, and newest;
- detail pages containing color roles, typography scales, spacing, radii, shadows, component recipes, layout guidance, do/don't rules, and exportable DESIGN.md/CSS/Tailwind tokens;
- related-style recommendations.

It does not provide a finished reusable website for each entry. Each subdomain therefore needs an original site concept built from the selected style reference.

## Product structure

### Hub

The root host is a gallery and control surface:

- hero with search and category filters;
- responsive preview-card grid;
- filters for visual category, theme, industry, and implementation status;
- sort by recently added and alphabetical;
- card metadata: style name, short description, dominant colors, status, and last update;
- links to the live subdomain and a hub detail page;
- accessible keyboard navigation and mobile layouts.

### Demo subdomains

Each style slug resolves to one complete demo site:

- `apple.<domain>`: restrained product landing page using the Apple-derived design language;
- `linear.<domain>`: dark precision SaaS/productivity landing page;
- `miranda.<domain>`: editorial publication experience;
- `slush.<domain>`: playful high-color product experience;
- future entries follow the same contract.

For local development and deployment previews, every site also has a path fallback such as `/sites/apple`. This makes QA possible before wildcard DNS is connected; production navigation prefers subdomains.

## Technical architecture

Use one application rather than one repository per site.

1. A host resolver reads the request hostname and maps the subdomain to a style slug.
2. The root hostname renders the hub.
3. A registered style slug renders its complete demo site.
4. `/sites/[slug]` renders the same demo for local and preview environments.
5. A typed registry supplies hub metadata, status, source reference, screenshot, and the component used for that demo.

Suggested structure:

```text
app/
  page.tsx                 # Hub
  sites/[slug]/page.tsx    # Preview/path fallback
  styles/[slug]/page.tsx   # Hub detail page
  _sites/
    registry.ts
    apple/
    linear/
    miranda/
    slush/
middleware.ts              # Host-to-site routing
public/
  previews/
  sites/
data/
  styles/
```

Each demo owns its tokens and components so visual systems do not leak into one another. Shared code is limited to routing, metadata, accessibility primitives, analytics hooks, and preview capture utilities.

## Style registry contract

Each entry should record:

- stable slug and display name;
- public Refero source URL and original brand/source URL;
- design category and light/dark theme;
- short design-language description;
- token file or token object;
- demo component/module;
- preview image;
- implementation status (`planned`, `building`, `review`, `live`);
- completion checklist and last-updated timestamp.

The registry is the single source of truth for the hub, routes, previews, and scheduled implementation queue.

## Deployment and DNS

Production requires a domain whose DNS can be changed.

- root/apex or `www` serves the hub;
- wildcard DNS `*.<domain>` points to the same deployment;
- application routing selects the demo from the `Host` header;
- unknown subdomains return a branded 404 with a link back to the hub;
- TLS must cover the wildcard domain;
- preview deployments use path fallback until wildcard DNS is available.

The actual custom-domain connection remains blocked until the target domain and hosting/DNS provider are confirmed. Implementation can proceed locally without that decision.

## Phased delivery

### Phase 0 — Foundation

- initialize the site project on this feature branch;
- add the host resolver, route fallback, typed registry, and status model;
- establish tests for hostname parsing and unknown slugs;
- add project documentation and example environment configuration.

Exit criterion: the root host and a placeholder demo resolve correctly in local and preview environments.

### Phase 1 — Hub MVP

- build the complete responsive hub;
- add search, category/theme/status filters, and sorting;
- add original hub branding and empty/loading/error states;
- validate accessibility, mobile behavior, and production build.

Exit criterion: users can browse and open registered demos from the hub.

### Phase 2 — First complete demo

- implement the Apple-derived product landing page using original product/content/imagery;
- keep brand names out of the demo UI unless used only as source attribution;
- add preview capture, registry metadata, and responsive QA.

Exit criterion: one polished, complete demo is reachable by path and hostname routing.

### Phase 3 — Diverse starter collection

- add Linear-derived dark SaaS demo;
- add Miranda-derived editorial demo;
- add Slush-derived playful demo;
- verify that tokens and CSS remain isolated between sites.

Exit criterion: four visually distinct complete demos are live in the hub.

### Phase 4 — Production domain

- connect the chosen deployment and DNS provider;
- configure apex/`www`, wildcard subdomain, and wildcard TLS;
- verify direct links, canonical URLs, Open Graph metadata, and unknown-subdomain behavior.

Exit criterion: the hub and all registered demos work on the real domain.

### Phase 5 — Ongoing catalog expansion

- select one high-quality, sufficiently distinct Refero style at a time;
- save source attribution and design notes;
- implement one complete original demo;
- run build, interaction, responsive, and accessibility checks;
- add a preview and mark it live only after review.

Avoid bulk scraping or mechanically publishing hundreds of low-quality clones. The target cadence is one verified demo per scheduled run after the foundation is stable.

## Quality gate for every demo

- complete header, main content, meaningful interactions, and footer;
- original copy and assets with recorded provenance;
- responsive at mobile, tablet, and desktop widths;
- keyboard usable and respects reduced motion;
- no cross-site CSS/token leakage;
- no broken links or console errors;
- production build passes;
- source attribution is present in hub metadata;
- preview image matches the live implementation;
- direct subdomain and path fallback both resolve.

## Git workflow

- all work stays on `feature/design-hub` or a later `feature/<name>` branch;
- commits use `feat:`, `fix:`, `docs:`, `chore:`, or `refactor:` prefixes;
- no force pushes;
- implementation may be committed and pushed when a remote is available;
- merging into `main` is reserved for human review and explicit approval.

## Decisions needed before production release

1. The real domain to use.
2. The DNS/deployment provider that controls wildcard records and TLS.
3. Whether the demo content should share one fictional product family or use a different fictional concept per style.

These choices do not block Phases 0–3.
