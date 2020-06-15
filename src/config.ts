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
  telegramToken: required(`BOT_TOKEN`),
  tokenName: required(`TOKEN_NAME`),
  tokenId: required(`TOKEN_ID`),
  tokenInitialQty: Number(required(`TOKEN_INITIAL_QUANTITY`)),
  tokenDecimal: Number(env.TOKEN_DECIMAL) || 6,
  tokenMinimumValue: (Number(env.TOKEN_DECIMAL)===0?'1':`0.${'0'.repeat(Number(env.TOKEN_DECIMAL)-1)}1`) || '0.000001',
  dbHost: env.DB_HOST || 'localhost',
  dbPort: env.DB_PORT || 5432,
  dbUser: required('DB_USERNAME'),
  dbPass: required('DB_PASS'),
  dbName: env.DB_NAME || 'slpbotdb',
  walletMnemo : required('WALLET_MNEMONIC')
}));

export type Config = ReturnType<typeof readConfig>;
