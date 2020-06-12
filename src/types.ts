import { Connection } from 'typeorm';
import * as telegraf from 'telegraf';
import { Config } from './config';
import { Account } from './models/account';

export type BotContext = telegraf.Context & {
  username: string;
  userId: string;
  args: string[];
  account: Account;
  conn: Connection;
  config: Config;
};

export type CommandHandler = <T extends BotContext>(context: T) => void | Promise<unknown>;

export { Config } from './config';
