'use strict';

const fs = require('fs');
const {promisify} = require('util');

const writeFileAsync = promisify(fs.writeFile);

module.exports = async (ctx) => {

	const path = 'source/service/reportFile.txt';

	const cardId = Number(ctx.params.id);
	const cards = await ctx.cardsModel.getAll();
	let card = cards.filter((card) => {
		return card.id === cardId;
	})[0];

	card = {
		cardNumber: card.cardNumber,
		balance: card.balance
	};

	const startTransactions = await ctx.transactionsModel.getByCard(cardId);
	const transactions = startTransactions.map((transaction) => {
		const {type, data, sum, time} = transaction;
		return {type,data, sum, time};
	});

	const req = {card, transactions};

	await writeFileAsync(path, JSON.stringify(req, null, 4));

	ctx.attachment('reportFile.txt');
	ctx.body = fs.createReadStream('source/service/reportFile.txt');
};
