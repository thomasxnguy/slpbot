import { CommandHandler } from '../types';

const Description = 'Deposit tokens'

/*
  Handle logic to withdraw tokens.
 */
const Handler: CommandHandler = async ctx => {
  const { conn } = ctx;

  if (ctx.chat?.type !== 'private') {
    await ctx.reply(`Command must be used in a private chat`);
    return;
  }

  const { account } = ctx;

  await ctx.reply(
      `Usage: Send deposit to this address: @${account.slpAddress}`
  );
}


export default { Handler, Description};
