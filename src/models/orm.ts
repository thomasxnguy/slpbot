import 'reflect-metadata';
import {createConnection} from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as pMemoize from 'p-memoize';
import { Config } from '../config';
import {Account} from "./account";
import {TransferHistory} from "./transferHistory";
import {TransferPending} from "./transferPending";

/**
 * ORM connection.
 */
export const connection = pMemoize(async (config: Config) => {
  const ssl = process.env.PGSSLMODE === 'off' ? false : { rejectUnauthorized: false };

  return createConnection({
    type: 'postgres',
    host: config.dbHost,
    port: Number(config.dbPort),
    username: config.dbUser,
    password: config.dbPass,
    database: config.dbName,
    entities: [Account, TransferHistory, TransferPending],
    logging: "all",
    namingStrategy: new SnakeNamingStrategy(),
    ssl: process.env.DATABASE_SSL === `true`,
    cli: {
      migrationsDir: 'src/migrations',
    },
  });
});

