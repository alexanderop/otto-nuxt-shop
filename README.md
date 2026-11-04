# OTTO Demo-Shop (Nuxt)

A simplified otto.de clone for a talk. Built with Nuxt 4 and OTTO's open-source
[B2B Design System](https://github.com/otto-de/b2b-design-system)
(`@otto-de/b2b-core-components`, Stencil web components).

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Hero, category tiles, product carousels |
| `/kategorie/[slug]` | Listing with filter chips, sorting, pagination (state lives in the URL) |
| `/suche?q=` | Search results (header search with live suggestions) |
| `/p/[id]` | Product page: gallery, buy box, tabs, related products |
| `/warenkorb` | Cart (cookie-based, so it survives SSR) |
| `/merkzettel` | Wishlist |

Data: `server/data/products.json` (snapshot of dummyjson.com), served by
`server/api/products`; the homepage content comes from `server/api/home`.
Product images are stored in `public/products/` (30 MB), because dummyjson's CDN
stalls when a page requests a few hundred images at once. The design system's
icons and the OttoSans font still load from OTTO's CDN, so the demo needs internet.

## How it compares to otto.de

The layout follows the real homepage: grey `#f0f0f0` page with white rounded
cards, a pill-shaped search, two-row category nav, coupon cards, teaser and
product carousels, and the beige "Jetzt extra sparen" block. The look is
OTTO's B2C shop, but the component library is the **B2B** one, so a few
pieces are custom on purpose:

| Piece | Built with | Why |
| --- | --- | --- |
| Search | Custom `SearchBox.vue` | `b2b-search` is a square input with a red button; otto.de uses a grey pill |
| Product cards | Plain markup | `b2b-card` adds a border and shadow that otto.de doesn't have |
| Headings | Native `h1`/`h2` | `b2b-headline` renders red at size 400 |
| Buttons, chips, dropdown, pagination, breadcrumb, tabs, snackbar, icons, progress bar | `b2b-*` components | Close enough to the B2C look |

Only the homepage could be compared automatically: otto.de's category, search
and product pages are protected by Kasada and render blank in headless browsers.

## Wiring the design system into Nuxt

1. `nuxt.config.ts`: load the CSS, which brings in the tokens and the OttoSans font, and tell Vue that `b2b-*` tags are custom elements.
2. `app/plugins/otto-design-system.client.ts`: `defineCustomElements(window)`. Run it only on the client. On the server the tags render as plain HTML, and the browser upgrades them later.

## Gotchas (good talk material)

- **Array props need `.prop` with the camelCase name.** `:optionsList.prop="list"` works. `:options-list.prop` sets a DOM property literally named `options-list`, and nothing happens.
- **`b2b-icon-100` renders nothing below 24px.** It accepts only sizes from 24 to 96, and anything else renders empty with no visible error.
- **Events are kebab-case custom events.** Use `@b2b-change`, `@b2b-selected`, `@b2b-page-change`, and read the payload from `event.detail`.
- **`b2b-rounded-icon` is fixed at 24px**, so the category tiles use a plain CSS circle instead.
