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
`server/api/products`. Product images and the design system's icons and fonts
load from remote CDNs, so the demo needs internet.

## Wiring the design system into Nuxt

1. `nuxt.config.ts`: load the CSS, which brings in the tokens and the OttoSans font, and tell Vue that `b2b-*` tags are custom elements.
2. `app/plugins/otto-design-system.client.ts`: `defineCustomElements(window)`. Run it only on the client. On the server the tags render as plain HTML, and the browser upgrades them later.

## Gotchas (good talk material)

- **Array props need `.prop` with the camelCase name.** `:optionsList.prop="list"` works. `:options-list.prop` sets a DOM property literally named `options-list`, and nothing happens.
- **`b2b-icon-100` renders nothing below 24px.** It accepts only sizes from 24 to 96, and anything else renders empty with no visible error.
- **Events are kebab-case custom events.** Use `@b2b-change`, `@b2b-selected`, `@b2b-page-change`, and read the payload from `event.detail`.
- **`b2b-rounded-icon` is fixed at 24px**, so the category tiles use a plain CSS circle instead.
