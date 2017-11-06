'use strict';

module.exports = async (ctx) => {
	const card = ctx.request.body;
	const userId = ctx.authData.user.id;
	card.userId = userId;
	const newCard = await ctx.cardsModel.create(card);
	ctx.status = 201;
	ctx.body = newCard;
};
