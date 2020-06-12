import { memoize } from 'lodash';

export const getProcessExitPromise = memoize(
  () =>
    new Promise<void>(resolve => {
      process.on('SIGINT', () => resolve());
      process.on('SIGTERM', () => resolve());
    })
);
