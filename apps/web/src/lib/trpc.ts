import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '@docunest/api/src/routers';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/trpc';

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: apiUrl
    })
  ]
});
