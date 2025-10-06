FROM node:20-bullseye-slim
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate
COPY . .
RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @docunest/web build
CMD ["pnpm", "--filter", "@docunest/web", "start"]
