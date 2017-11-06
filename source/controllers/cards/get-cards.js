'use strict';

module.exports = async (ctx) => {
	console.log('get cards', ctx.req.headers);
	ctx.body = await ctx.cardsModel.getAll();
};
