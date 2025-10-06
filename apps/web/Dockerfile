FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml tsconfig.base.json .
COPY packages ./packages
COPY apps ./apps
RUN pnpm install --ignore-scripts --frozen-lockfile=false
RUN pnpm --filter @docunest/web... build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/public ./apps/web/public
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "./node_modules/next/dist/bin/next", "start", "-p", "3000"]
