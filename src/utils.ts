import { memoize } from 'lodash';
import {ValueTransformer} from "typeorm";

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

export const isNumber = (value: string | number) => {
    return ((value != null) &&
        (value !== '') &&
        !Number.isNaN(Number(value.toString())));
}

function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
    return typeof obj === "undefined" || obj === null
}

export class ColumnNumericTransformer implements ValueTransformer {
    to(data?: number | null): number | null {
        if (!isNullOrUndefined(data)) {
            return data
        }
        return null
    }

    from(data?: string | null): number | null {
        if (!isNullOrUndefined(data)) {
            const res = parseFloat(data)
            if (Number.isNaN(res)) {
                return null
            }
            return res
        }
        return null
    }
}