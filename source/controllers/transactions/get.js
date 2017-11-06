'use strict';

module.exports = async (ctx) => {
	const cardId = Number(ctx.params.id);
	const userId = ctx.authData.user.id;
	ctx.body = await ctx.transactionsModel.getByCard(cardId, userId);
};
