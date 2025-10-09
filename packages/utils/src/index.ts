import dotenv from 'dotenv';
import pino from 'pino';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  DATABASE_URL: z.string().url(),
  QDRANT_URL: z.string().url().default('http://localhost:6333'),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  S3_ENDPOINT: z.string().url(),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(8),
  AI_PROVIDER: z.string().default('openai'),
  OPENAI_API_KEY: z.string().min(1).optional(),
  VECTOR_BACKEND: z.string().default('qdrant'),
  PORT: z.string().transform(Number).default('4000'),
  ALLOWED_ORIGINS: z.string().optional(),
  JWT_SECRET: z.string().min(32).optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  FRONTEND_URL: z.string().url().optional(),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export const getEnv = (): Env => {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(`Invalid environment configuration: ${result.error.message}`);
  }

  cachedEnv = result.data;
  return cachedEnv;
};

export const logger = pino({
  level: getEnv().LOG_LEVEL,
  transport:
    getEnv().NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        }
      : undefined,
});
