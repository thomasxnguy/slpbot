import { CommandHandler } from '../types';

const Description = 'Get the balance for current account'

const Handler: CommandHandler = async ctx => {
  await ctx.reply(`${ctx.account.balance} ${ctx.config.tokenId}`);
};

export default { Handler, Description};
