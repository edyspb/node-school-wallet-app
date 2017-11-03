'use strict';

const fs = require('fs');
const {promisify} = require('util');

const writeFileAsync = promisify(fs.writeFile);

module.exports = async (ctx) => {

	const name = 'reportFile';
	const format = ctx.params.format;
	const cardId = Number(ctx.params.id);

	const startTransactions = await ctx.transactionsModel.getByCard(cardId);

	let data;
	let transactions;

	const cards = await ctx.cardsModel.getAll();
	let card = cards.filter((card) => {
		return card.id === cardId;
	})[0];



	switch (format) {
		case 'txt':
			card = {
				cardNumber: card.cardNumber,
				balance: card.balance
			};

			transactions = startTransactions.map((transaction) => {
				const {type, data, sum, time} = transaction;
				return {type,data, sum, time};
			});
			data = JSON.stringify({card, transactions}, null, 4);
			break;

		case 'xls':
			card = `"Номер карты","Баланс"\n"${card.cardNumber}","${card.balance}"`;
			data = card;
			break;
		default:
			break;
	}


	ctx.attachment(`${name}.${format}`);
	ctx.body = data;
};
