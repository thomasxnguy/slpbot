import { CommandHandler } from '../types';

const Description = 'Create an account'

const Handler: CommandHandler = async ctx => {
  if (ctx.chat?.type === 'private') {
    await ctx.reply(`You're all set! Next try /help`);
  } else {
    await ctx.reply(`You're all set, @${ctx.username}`);
  }
};

export default { Handler, Description};
