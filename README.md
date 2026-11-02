# cabral.ro

## Project setup

```bash
npm install
```

## Configuration

- `WP_URL`: the WordPress address used for API calls, without a trailing
  slash. WordPress must answer at `$WP_URL/wp-json/` and
  `$WP_URL/wordpress/graphql`. Default: `https://www.cabral.ro`.

It is read at build time (`npm run nuxt:build`). The production build in
GitHub Actions takes it from the `WP_URL` repository variable.
