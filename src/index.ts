import { Telegraf } from 'telegraf';
import { Config } from './config';
import * as orm from './models/orm';
import { BotContext } from './types';
import { getProcessExitPromise } from './utils';
import { getOrCreateAccountForTelegramUser } from './services/account.service';
import { SetupBotCommand } from './commands/index';

const main = async (config: Config): Promise<void> => {
  const conn = await orm.connection(config);

  const bot = new Telegraf<BotContext>(config.telegramToken);

  // Hydrate context
  bot.use(async (ctx, next) => {
    const userId = ctx.from?.id.toString();

    if (!userId) {
      return;
    }

    const username = ctx.from?.username;

    if (!username) {
      if (ctx.chat?.type === 'private') {
        await ctx.reply(`You need to set a username for your Telegram account`);
      }

      return;
    }

    const args = ctx.message?.text?.split(/ /g).slice(1);

    if (!args) {
      return;
    }

    Object.assign(ctx, {
      userId,
      username,
      args,
      conn,
      account: await getOrCreateAccountForTelegramUser(conn, userId, username, config.tokenId),
      config
    });

    await next();
  });

  // Command wrapper to add error handling
  bot.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      console.error(error.stack);

      if (process.env.NODE_ENV === 'production') {
        await ctx.reply(`Error!`);
      } else {
        await ctx.reply(error.stack);
      }
    }
  });

  // Add commands
  SetupBotCommand(bot);

  await bot.launch();

  console.log('Bot online!');

  await getProcessExitPromise();

};

export default main;
