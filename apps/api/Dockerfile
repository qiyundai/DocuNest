FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml tsconfig.base.json .
COPY packages ./packages
COPY apps ./apps
RUN pnpm install --ignore-scripts --frozen-lockfile=false
RUN pnpm --filter @docunest/api... build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "apps/api/dist/server.js"]
