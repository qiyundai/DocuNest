FROM node:20-bullseye-slim AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/worker ./apps/worker
COPY packages ./packages
COPY tsconfig.base.json ./

# Build the application
RUN pnpm --filter @docunest/worker build

# Production stage
FROM node:20-bullseye-slim AS production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# Copy only necessary files
COPY --from=base /app/apps/worker/dist ./dist
COPY --from=base /app/apps/worker/package.json ./
COPY --from=base /app/node_modules ./node_modules

CMD ["node", "dist/index.js"]
