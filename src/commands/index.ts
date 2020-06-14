import {Telegraf} from 'telegraf';
import { BotContext, CommandHandler } from '../types';
import tipCommandHandler from './tip';
import tipReplyCommandHandler from './tipReply';
import balanceCommandHandler from './balance';
import startCommandHandler from './start';
import withdrawCommandHandler from './withdraw';

const handlers: Record<string, CommandHandler> = {
  tip: tipCommandHandler.Handler,
  balance: balanceCommandHandler.Handler,
  start: startCommandHandler.Handler,
  withdraw: withdrawCommandHandler.Handler,
};

const descriptions: Record<string, string> = {
  tip: tipCommandHandler.Description,
  balance: balanceCommandHandler.Description,
  withdraw: withdrawCommandHandler.Description,
};

/*
  Setup methods for the bot. Register all the handlers (command, hears ...) and the help message.
 */
export const SetupBotCommand = (
  bot: Telegraf<BotContext>
): void => {

  // Register commands
  for (const commandName of Object.keys(handlers)) {
    bot.command(commandName, handlers[commandName]);
  }

  // Register reply handler
  bot.hears(/^tip (\d*\.?\d*)/, tipReplyCommandHandler.Handler);

  // Register help message
  let helpMessage = `Command list: \n`
  for (const commandName of Object.keys(descriptions)) {
    helpMessage += `/${commandName} : ${descriptions[commandName]}.\n`;
  }

  bot.command(`help`, async ctx => {
    await ctx.reply(helpMessage);
  });
};