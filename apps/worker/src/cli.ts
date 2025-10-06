import { logger } from '@docunest/utils';
import { startWorker } from './index';

(async () => {
  const { shutdown } = startWorker();
  logger.info('Worker started');

  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      logger.info({ signal }, 'Shutting down worker');
      await shutdown();
      process.exit(0);
    });
  });
})();
