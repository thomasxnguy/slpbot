import { memoize } from 'lodash';

export const getProcessExitPromise = memoize(
  () =>
    new Promise<void>(resolve => {
      process.on('SIGINT', () => resolve());
      process.on('SIGTERM', () => resolve());
    })
);

export const truncateDecimals = (num : string, decimal : number) : string => {
        const decPos = num.indexOf('.');
        const substrLength = decPos === -1 ? num.length : 1 + decPos + decimal;
        const trimmedResult = num.substr(0, substrLength);
        const finalResult = trimmedResult === ''? '0' : trimmedResult;

    return finalResult;
}