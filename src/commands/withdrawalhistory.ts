import { CommandHandler } from '../types';

import {getAccountWithWithdrawal} from "../services/account.service";

const Description = 'Get the history of all withdrawal'

/*
  Handle logic for the Withdrawal history command. Just print to the user its amount.
 */
const Handler: CommandHandler = async ctx => {
  const { conn } = ctx;

  if (ctx.chat?.type !== 'private') {
    await ctx.reply(`Command must be used in a private chat`);
    return;
  }

  const { args, account } = ctx;

  const usage = () =>
      ctx.reply(
          `Usage: /withdrawhistory <limit>. Example: /withdrawhistoru 50`
      );


  try {
    const accountWithHistory = await getAccountWithWithdrawal(conn, account.id, ctx.config.tokenId);
    if (accountWithHistory === undefined) {
    // Error should not happen.
      return;
    }
    const history = accountWithHistory.withdrawals;
    if (history === undefined || history.length === 0) {
      await ctx.reply('No withdrawal has been recorded. Try /withdraw to withdraw your token');
      return;
    }

    let msg = 'Withdrawal history : \n'
    for (const element of history) {
      msg = msg.concat(`- ${element.createdAt} - ${element.amount} ${ctx.config.tokenName} sent to address [${element.address}]\n txId : ${element.txId}\n`)
    }
    await ctx.reply(msg);

  } catch (error) {
    await ctx.reply('Retrieving withdrawal history failed, please try again...');
  }

};

export default { Handler, Description};
