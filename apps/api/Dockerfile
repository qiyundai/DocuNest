FROM node:20-bullseye-slim AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api
COPY packages ./packages
COPY tsconfig.base.json ./

# Build the application
RUN pnpm --filter @docunest/api build

# Production stage
FROM node:20-bullseye-slim AS production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# Copy only necessary files
COPY --from=base /app/apps/api/dist ./dist
COPY --from=base /app/apps/api/package.json ./
COPY --from=base /app/node_modules ./node_modules

CMD ["node", "dist/server.js"]
