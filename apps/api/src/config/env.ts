import { getEnv } from '@docunest/utils';

export const env = getEnv();

export const apiConfig = {
  port: Number(process.env.PORT ?? 4000)
};
