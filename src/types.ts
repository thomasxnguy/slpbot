import { Connection } from 'typeorm';
import * as telegraf from 'telegraf';
import * as orm from './orm';
import { Config } from './config';

export type BotContext = telegraf.Context & {
  username: string;
  userId: string;
  args: string[];
  account: orm.Account;
  conn: Connection;
  config: Config;
};

export type CommandHandler = <T extends BotContext>(context: T) => void | Promise<unknown>;

export { Config } from './config';
