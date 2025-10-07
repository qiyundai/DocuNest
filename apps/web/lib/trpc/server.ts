import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@docunest/api';
import superjson from 'superjson';
import { DEFAULT_TENANT_ID } from '../constants';

const getBaseUrl = () => process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const serverClient = () =>
  createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/trpc`,
        headers() {
          return {
            'x-tenant-id': process.env.TENANT_ID ?? DEFAULT_TENANT_ID,
          };
        },
      }),
    ],
  });
