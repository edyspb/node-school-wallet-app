'use strict';

module.exports = async (ctx) => {

	const name = 'reportFile';
	const format = ctx.params.format;
	const cardId = Number(ctx.params.id);
	console.log(ctx);
	const startTransactions = await ctx.transactionsModel.getByCard(cardId);
	startTransactions.forEach((item) => {
		switch(item.type) {
			case 'card2Card':
				item.type = 'Перевод с карты на карту';
				break;
			case 'paymentMobile':
				item.type = 'Пополнение телефона';
				break;
			case 'prepaidCard':
				item.type = 'Пополнение карты';
				break;
			case 'withdrawCard':
				item.type = 'Снятие с карты';
				break;
		}
		if ((typeof item.data) === 'object') {
			for (let key in item.data) {
				item.data = item.data[key];
			}
		}
	});

	let data;
	let transactions;

	const cards = await ctx.cardsModel.getAll();
	let card = cards.filter((card) => {
		return card.id === cardId;
	})[0];



	switch (format) {
		case 'txt':
			card = `Карта: \nНомер карты: ${card.cardNumber}\nБаланс: ${card.balance}`;
			transactions = 'Транзакции:\n';

			startTransactions.forEach((item, i) => {
				let {type, data, sum, time} = item;
				transactions += `\nНомер транзакции: ${i}\nТип операции: ${type}\n` +
					`Данные: ${data}\nСумма: ${sum}\nВремя: ${time}\n`;
			});
			data = `${card}\n\n${transactions}`;
			ctx.attachment(`${name}.${format}`);
			break;

		case 'xls':
			card = `"Номер карты","Баланс"\n"${card.cardNumber}","${card.balance}\n"`;
			let number = `"Номер транзаккции"`;
			let type = `"Тип операции"`;
			let dataT = `"Данные"`;
			let sum = `"Сумма"`;
			let time = `"Время"`;
			startTransactions.forEach((item, i) => {
				number += `,${i}`;
				type += `,"${item.type}"`;
				dataT += `,"${item.data}"`;
				sum += `,"${item.sum}"`;
				time += `,"${item.time}"`;
			});
			data = `${card}\n${number}\n${type}\n${dataT}\n${sum}\n${time}`;
			ctx.attachment(`${name}.${format}`);
			break;
		case 'screen':
			data = startTransactions;
			break;
		default:
			break;
	}

	ctx.body = data;
};
