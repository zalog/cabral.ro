# cabral.ro

## Project setup

```bash
npm install
```

## Configuration

- `NUXT_WP_URL`: the WordPress address the server talks to, without a
  trailing slash. WordPress must answer at `$NUXT_WP_URL/wp-json/`.
  Default: `https://wp.cabral.ro`.

It is read when the server starts, so it goes in the container
environment, not in the build.

The browser talks only to this server, through `/api/wp/`, and the
server talks to WordPress. With comment and contact form posts it sends
WordPress the visitor's address in `X-Forwarded-For` (the first address
of the request's own `X-Forwarded-For`), and the user agent, referer and
language, for the spam checks. WordPress must take the visitor's address
from that header, and only from this server.

## Container image

```bash
docker build --build-arg NODE_VERSION=$(cat .nvmrc) -t cabral.ro .
docker run --rm -p 3000:3000 cabral.ro
```

The server listens on port 3000 and runs as the `node` user. The
Node.js version comes from `.nvmrc`.

## Release

Push a version tag, for example `8.3.4`. The `prod` workflow builds the
image, runs it and checks `/favicon.ico` and `/`, then pushes
`ghcr.io/zalog/cabral.ro:8.3.4` and moves the `prod` tag to it. The
server checks `prod` every 5 minutes and runs the new image.

The server health check requests `/favicon.ico`. If a new image does
not answer it, the server goes back to the previous image, so
`public/favicon.ico` must stay.

## Rollback

Run the `prod` workflow by hand (Actions, `prod`, Run workflow) with a
version that was already released, for example `8.3.3`. It moves the
`prod` tag to that image without a new build. Do this also when the
server went back to the previous image on its own, because `prod` still
points to the image that failed.
