'use strict';

module.exports = async (ctx) => {
  const userId = ctx.authData.user.id;
  ctx.body = await ctx.transactionsModel.getByAll({userId});
};
