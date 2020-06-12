import * as orm from '../orm';
import { CommandHandler } from '../types';

const Description = 'Send a tip to another user'

const Handler: CommandHandler = async ctx => {
  const { conn } = ctx;

  const usage = () => ctx.reply(`Usage: /tip @username <amount>. Example: /tip @brekken 10`);

  const { args, account } = ctx;

  if (args.length < 2) {
    await usage();
    return;
  }

  const [receiverRaw, amountRaw] = args;

  const receiverUsername = receiverRaw.match(/^@([a-z0-9_]+)$/i)?.[1];

  if (!receiverUsername) {
    await usage();
    return;
  }

  const receiver = await conn.getRepository(orm.Account).findOne({ username: receiverUsername, tokenId: ctx.config.tokenId });

  if (!receiver) {
    await ctx.reply(`I don't know who @${receiverUsername} is. Have them say /start`);
    return;
  }

  const amount = parseFloat(amountRaw);

  if (!(amount > 0)) {
    await usage();
    return;
  }

  try {
    await conn.getRepository(orm.Transfer).save(
      Object.assign(new orm.Transfer(), {
        id: new Date().getTime().toString(),
        tokenId: ctx.config.tokenId,
        createdAt: new Date().toISOString(),
        fromAccountId: account.id,
        toAccountId: receiver.id,
        amount: amount.toString(),
      })
    );
  } catch (error) {
    if (error.message.match(/account_check/)) {
      await ctx.reply(`Insufficient funds`);
      return;
    }

    throw error;
  }

  const senderUsername = ctx.from?.username ?? 'You';

  await ctx.reply(`${senderUsername} tipped ${amount} ${ctx.config.tokenId} to @${receiverUsername}`);
};

export default {Handler, Description};
