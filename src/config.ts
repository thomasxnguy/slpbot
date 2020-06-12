import { memoize } from 'lodash';

const required = (key: string, env = process.env): string => {
  const value = env[key];

  if (value === undefined) {
    throw new Error(`${env} is required`);
  }

  return value;
};

/**
 * Read configuration from environment variables with defaults.
 */
export const readConfig = memoize((env = process.env) => ({
  databaseUrl: env.DATABASE_URL || 'postgres://localhost/walletslp',
  telegramToken: required(`BOT_TOKEN`),
  tokenId: required(`TOKEN_ID`),
  dbUser: required('DB_USERNAME'),
  dbPass: required('DB_PASS')
}));

export type Config = ReturnType<typeof readConfig>;
