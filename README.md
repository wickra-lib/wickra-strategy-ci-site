<p align="center">
  <a href="https://strategy-ci.wickra.org"><img src="https://raw.githubusercontent.com/wickra-lib/.github/main/profile/wickra-banner.webp?v=514" alt="Wickra Strategy-CI — golden-pin your strategy's backtest report and catch regressions in CI" width="100%"></a>
</p>

[![Built on Wickra](https://img.shields.io/badge/built%20on-wickra-3b82f6)](https://github.com/wickra-lib/wickra)
[![Docs](https://raw.githubusercontent.com/wickra-lib/.github/main/profile/badges/wickra-strategy-ci/docs.svg)](https://docs.wickra.org)
[![License: MIT OR Apache-2.0](https://raw.githubusercontent.com/wickra-lib/.github/main/profile/badges/wickra-strategy-ci/license.svg)](https://github.com/wickra-lib/wickra-strategy-ci#license)
[![Built with VitePress](https://img.shields.io/badge/built%20with-VitePress-5c73e7?logo=vite&logoColor=white)](https://vitepress.dev)

---

Source for the Wickra Strategy-CI marketing site
(**[strategy-ci.wickra.org](https://strategy-ci.wickra.org)**): hero, benchmarks, and
per-language API overviews. Built with [VitePress](https://vitepress.dev).

The structure mirrors [webpage](https://github.com/wickra-lib/webpage) (wickra.org)
and [wickra-docs](https://github.com/wickra-lib/wickra-docs) (docs.wickra.org): shared
header, footer, theme, badge pipeline, and workflows.

Wickra Strategy-CI golden-pins a strategy's backtest report, catches regressions in
CI, and property-tests it against fuzzed market data. The library itself is
[`wickra-lib/wickra-strategy-ci`](https://github.com/wickra-lib/wickra-strategy-ci).

## No live demo, deliberately

The sibling sites embed a WASM demo that loads their published npm bundle.
`wickra-strategy-ci-wasm` has not been released yet, so there is nothing to load — and
a demo panel that cannot work is worse than no demo panel. It goes in when the package
ships, along with the `vite-plugin-wasm` build plugins the other sites carry.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (also fails on dead internal links)
npm run preview  # preview the production build
```

## Deploy

Static build via Cloudflare Pages:

- **Build command:** `npm run build`
- **Output directory:** `.vitepress/dist`
- **Node version:** 20

Custom domain `strategy-ci.wickra.org` is configured in the Cloudflare Pages dashboard.

## License

Dual-licensed under [MIT](LICENSE-MIT) or [Apache-2.0](LICENSE-APACHE), at your option.
