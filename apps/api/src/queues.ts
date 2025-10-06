import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { env } from './config/env';

const connection = new IORedis(env.REDIS_URL ?? 'redis://localhost:6379');

export const ingestQueue = new Queue('ingest', { connection });
export const embedQueue = new Queue('embed', { connection });
