[![Deployed on Vercel](https://img.shields.io/badge/deployed-success.svg?style=flat-square&logo=Vercel&labelColor=000000&logoWidth=20)](https://vercel.com/moment/ui)

## Spirit of UI Codebase

This codebase optimizes for "Time-to-Live" — the time it takes from idea to production deploy. Any technical decision should prioritize this mental model, and any code added to make it harder for "Time-to-Live" will be highly scrutinized.

## Quick Start

First, run [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) to install dependencies:

```shell
yarn
```

To run app in development:

```shell
yarn dev
```

To lint for any build errors:

```shell
yarn lint
```

To build app then run production build:

```shell
yarn build && yarn start
```

## What's Inside

```shell
📂 src // Next.js code (pages, components, hooks, etc.)
📂 public // Static assets
```

## Dependencies

- [React](https://reactjs.org/)
  - [react-dom](https://github.com/facebook/react/tree/master/packages/react-dom), [prop-types](https://github.com/facebook/prop-types)
- [Next.js](https://nextjs.org/)
  - [sharp](https://www.npmjs.com/package/sharp) (for Next.js images)
- [Tailwind CSS](https://tailwindcss.com/)
  - [autoprefixer](https://github.com/postcss/autoprefixer), [postcss](https://github.com/postcss/postcss), [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms)
- [Radix UI](https://www.radix-ui.com/)
- [Radix Colors](https://www.radix-ui.com/docs/colors/getting-started/installation)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [react-fast-marquee](https://github.com/justin-chu/react-fast-marquee)
- [react-parallax-tilt](https://github.com/mkosir/react-parallax-tilt)
- [framer-motion](https://github.com/framer/motion)

### Dev dependencies

- [prettier](https://github.com/prettier/prettier)
- [eslint](https://github.com/eslint/eslint)\*
- [eslint-config-next](https://www.npmjs.com/package/eslint-config-next)\*
- [typescript](https://github.com/microsoft/TypeScript)†

\* _Used for [Conformance](https://nextjs.org/blog/next-11#conformance)_

† _Used for [Conformance](https://nextjs.org/blog/next-11#conformance)_ and _[API Routes](https://nextjs.org/docs/api-routes/introduction)_ (if any)

## About Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
