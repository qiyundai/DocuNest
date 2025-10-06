FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml tsconfig.base.json .
COPY packages ./packages
COPY apps ./apps
RUN pnpm install --ignore-scripts --frozen-lockfile=false
RUN pnpm --filter @docunest/worker... build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/worker/dist ./apps/worker/dist
COPY --from=builder /app/apps/worker/package.json ./apps/worker/package.json
ENV NODE_ENV=production
CMD ["node", "apps/worker/dist/index.js"]
