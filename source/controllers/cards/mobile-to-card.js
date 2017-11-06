'use strict';

module.exports = async (ctx) => {
	const cardId = ctx.params.id;
	const userId = ctx.authData.user.id;

	const operation = ctx.request.body;
	const {phoneNumber, sum} = operation;

	ctx.cardsModel.refill(cardId, sum);

	const transaction = await ctx.transactionsModel.create({
		cardId,
		type: 'paymentMobile',
		data: {phoneNumber},
		time: new Date().toISOString(),
		sum,
		userId
	});

	ctx.status = 200;
	ctx.body = transaction;
};
