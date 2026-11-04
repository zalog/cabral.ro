# check=skip=InvalidDefaultArgInFrom

ARG NODE_VERSION

FROM node:${NODE_VERSION}-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run nuxt:build

FROM node:${NODE_VERSION}-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/.output .output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
