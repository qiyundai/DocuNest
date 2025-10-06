import { config as loadEnv } from 'dotenv';
import pino from 'pino';
import { z } from 'zod';

loadEnv();

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string().url(),
  QDRANT_URL: z.string().url().optional(),
  REDIS_URL: z.string().optional(),
  VECTOR_BACKEND: z.string().default('qdrant'),
  S3_ENDPOINT: z.string().url().optional(),
  S3_BUCKET: z.string().optional(),
  AI_PROVIDER: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        }
      : undefined,
});

export const getEnv = (): z.infer<typeof envSchema> => {
  if (!cachedEnv) {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      logger.error(result.error.flatten().fieldErrors, 'Invalid environment');
      throw new Error('Invalid environment configuration');
    }
    cachedEnv = result.data;
  }
  return cachedEnv;
};
