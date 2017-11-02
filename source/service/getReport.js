'use strict';

const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const writeFileAsync = promisify(fs.writeFile);

module.exports = async (ctx, next) => {
	const cardId = Number(ctx.params.id);
	const transactions = await ctx.transactionsModel.getByCard(cardId);


	const file = path.join('source/service/reportFile.txt');
	const redactData = (JSON.stringify(transactions, null, 4));
	await writeFileAsync(file, redactData);

	ctx.response.download = file;
	ctx.status = 200;
	//ctx.body = fs.readFileSync(file);
	//ctx.contentType = 'file';
};
