import { memoize } from 'lodash';
import { Connection } from 'typeorm';
import * as orm from './orm';

export const getOrCreateAccountForTelegramUser = async (
  conn: Connection,
  telegramUserId: string,
  username: string,
  tokenId: string,
): Promise<orm.Account> => {

  const account = await conn.getRepository(orm.Account).findOne({ id: telegramUserId, tokenId });

  if (account) {
    return account;
  }

  await conn.getRepository(orm.Account).save(
    Object.assign(new orm.Account(), {
      id: telegramUserId,
      tokenId,
      username,
      createdAt: new Date().toISOString(),
      balance: 50
    })
  );

  return getOrCreateAccountForTelegramUser(conn, telegramUserId, username, tokenId);
};

export const getProcessExitPromise = memoize(
  () =>
    new Promise<void>(resolve => {
      process.on('SIGINT', () => resolve());
      process.on('SIGTERM', () => resolve());
    })
);
