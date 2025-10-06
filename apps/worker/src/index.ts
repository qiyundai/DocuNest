import { logger } from '@docunest/utils';
import { startWorker } from './worker.js';

export const bootstrap = async () => {
  startWorker();
  logger.info('Worker started');
};

if (import.meta.url === `file://${process.argv[1]}`) {
  bootstrap().catch((err) => {
    logger.error({ err }, 'Worker failed to start');
    process.exit(1);
  });
}
