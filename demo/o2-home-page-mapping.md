# O2 Homescreen — Figma → AEM EDS Block Mapping

Source: Figma "Telefonica Innovation Day" › page **O2 Homescreen** (`0:1`), main frame `1:187` (1920w, ~8865px).
Target: AEM EDS page under `content/TEFInnoDay/language-masters/en`.
Brand: apply `o2-theme` (page-metadata Theme = O2) → nav white, footer/accents `#0050FF`.

## Global chrome

| Figma node | Section | Block | Reuse / New | Notes |
|---|---|---|---|---|
| `1:189` `div#top` (h≈234) | Utility bar + main nav + promobar | **header** | REUSE + restyle | O2 white nav via `o2-theme`; nav content authored as `/en/nav` fragment |
| `2:938` `footer.container` (h≈925) | Footer "Dein O2. Deiner Service." | **footer** | REUSE + restyle | O2 blue footer; authored as `/en/footer` fragment |

## main#content (`1:1368`, y=234) sections, top→bottom

| # | Figma node | Section | Block(s) | Reuse / New |
|---|---|---|---|---|
| 1 | `1:1369` (h648) | **Hero stage** — rotating (Samsung S26 FE): gradient bg, product image, stacked badges, headline, price block, white CTA, dots+pause | **teaser-stage** | **NEW** |
| 2 | `1:1469` (h186) | **Icon quicklinks** — circular icon links row | **icon-quicklinks** or `columns`+icons | NEW (small) / reuse |
| 3 | `1:1532` (h1272) | **"Handys mit Vertrag"** — blue banner + brand tabs (Apple/Samsung/Google/Xiaomi) + product-card carousel | **section-banner** + `tabs` + `carousel`[**product-card**] | NEW + REUSE |
| 4 | `1:1834` (h1194) | **"Handyverträge ohne Handy"** — same pattern | section-banner + tabs + carousel[product-card] | REUSE |
| 5 | `1:2043` (h1264) | SIM-only / colorful tiles — same pattern, colored card variant | section-banner + carousel[product-card `color` variant] | REUSE + variant |
| 6 | `1:2313` (h1306) | **"Top-Geräte und Gadgets"** — same pattern | section-banner + tabs + carousel[product-card] | REUSE |
| 7 | `1:2549` (h739) | **Promo band** — "Schnelles Internet ab 14,99 €" wide banner w/ icon + price + CTA | **promo-banner** | **NEW** |
| 8 | `1:2728` (w1232 h363) | **FAQ** — "Mobilfunkanbieter FAQ" expand/collapse | **accordion** | REUSE |

## New blocks to build (net = 4, +1 optional)

Build order for the Figma→page hero scenario:

1. **`teaser-stage`** (hero moment). Fields: `bgStyle` (gradient/image), `image` (product), `imageAlt`, `badges` (multi text/pill), `title`, `text` (richtext), `priceLabel` ("nur"), `priceValue` ("37"), `priceDecimals` ("49"), `priceSuffix` ("€ monatlich"), `ctalabel`, `ctalink`. Wrap multiple as autoplay carousel (mirror `carousel` autoplay/dots).
2. **`product-card`** (carousel item). Fields: `image`, `imageAlt`, `energyBadge` (A–G), `promoPill` (text, e.g. "0,- € Anschlusspreis"), `title`, `features` (richtext bullets), `priceLabel`, `priceValue`, `priceDecimals`, `priceSuffix`, `priceNote`, `ctalabel`, `ctalink`, `cardVariant` (white|color), `bgColor` (color variant). Lives inside `carousel` (add as allowed child) or a dedicated `product-carousel` container.
3. **`section-banner`**. Fields: `title` (richtext), `thumbnails` (multi image, optional), `bgStyle` (o2-blue-gradient default), `align`.
4. **`promo-banner`**. Fields: `image`/`icon`, `title`, `text`, `priceValue`+`priceSuffix`, `ctalabel`, `ctalink`, `bgStyle`.
5. *(optional)* **`icon-quicklinks`** — circular icon link row; can be approximated with `columns` + icon list.

All new blocks: reference `--brand-*` / `--main-accent-color` tokens only (no hard-coded hex) so they switch with `o2-theme`/`blau-theme`/`alditalk-theme`. Register via `blocks/<name>/_<name>.json` + add to the built `component-models.json`/`component-definition.json`/`component-filters.json` **directly** (do NOT run `npm run build:json` — sources are out of sync and a rebuild drops components). Ship each as a feature-branch PR.

## Reused blocks
header, footer, carousel (autoplay + dots already supported), tabs (brand filter chips), accordion (FAQ), title-block (section titles), columns (layout).

## Assets to import into `/content/dam/TEFInnoDay/en/`
Product imagery (phones, gadgets, PS5, MacBook), Samsung stage image, brand logos (Apple/Samsung/Google/Xiaomi), energy-label badges, O2 logo, footer payment icons — export from Figma, replace current WKND placeholders.
