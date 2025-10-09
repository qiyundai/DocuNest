FROM node:20-bullseye-slim AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/web ./apps/web
COPY packages ./packages
COPY tsconfig.base.json ./

# Build the application
RUN pnpm --filter @docunest/web build

# Production stage
FROM node:20-bullseye-slim AS production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# Copy only necessary files
COPY --from=base /app/apps/web/.next/standalone ./
COPY --from=base /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=base /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["node", "apps/web/server.js"]
