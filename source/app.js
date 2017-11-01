'use strict';

const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const getRouter = require('koa-router');
const bodyParser = require('koa-bodyparser')();

const logger = require('libs/logger')('app');

const {renderToStaticMarkup} = require('react-dom/server');

const getCardsController = require('./controllers/cards/get-cards');
const createCardController = require('./controllers/cards/create');
const deleteCardController = require('./controllers/cards/delete');
const getTransactionController = require('./controllers/transactions/get');
const createTransactionsController = require('./controllers/transactions/create');
const cardToCard = require('./controllers/cards/card-to-card');
const cardToMobile = require('./controllers/cards/card-to-mobile');
const mobileToCard = require('./controllers/cards/mobile-to-card');

const errorController = require('./controllers/error');

const ApplicationError = require('libs/application-error');
const CardsModel = require('source/models/cards');
const TransactionsModel = require('source/models/transactions');

const getTransactionsController = require('./controllers/transactions/get-transactions');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/school-wallet', { useMongoClient: true });
mongoose.Promise = global.Promise;

const app = new Koa();
const appRouter = getRouter();
const clientRouter = getRouter();
const apiRouter = getRouter();

function getView(viewId) {
	const viewPath = path.resolve(__dirname, 'views', `${viewId}.server.js`);
	delete require.cache[require.resolve(viewPath)];
	return require(viewPath);
}

async function getData(ctx) {
	const user = {
		login: 'samuel_johnson',
		name: 'Samuel Johnson'
	};
	const cards = await ctx.cardsModel.getAll();
	const transactions = await ctx.transactionsModel.getAll();

	return {
		user,
		cards,
		transactions
	};
}

// Сохраним параметр id в ctx.params.id
clientRouter.param('id', (id, ctx, next) => next());

clientRouter.all('client', '*', async (ctx) => {
	const data = await getData(ctx);
	const indexView = getView('index');
	const indexViewHtml = renderToStaticMarkup(indexView(ctx.originalUrl, data));

	ctx.body = indexViewHtml;
});

apiRouter.get('/cards/', getCardsController);
apiRouter.post('/cards/', createCardController);
apiRouter.delete('/cards/:id', deleteCardController);

apiRouter.get('/cards/:id/transactions/', getTransactionController);
apiRouter.post('/cards/:id/transactions/', createTransactionsController);

apiRouter.post('/cards/:id/transfer', cardToCard);
apiRouter.post('/cards/:id/pay', cardToMobile);
apiRouter.post('/cards/:id/fill', mobileToCard);

apiRouter.get('/transactions/', getTransactionsController);

apiRouter.all('/error', errorController);

// inizialize routes
appRouter.use('/api/v1', apiRouter.routes());
appRouter.use('/', clientRouter.routes());


// logger
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// error handler
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		logger.error('Error detected', err);
		ctx.status = err instanceof ApplicationError ? err.status : 500;
		ctx.body = `Error [${err.message}] :(`;
	}
});

// Создадим модель Cards и Transactions на уровне приложения и проинициализируем ее
app.use(async (ctx, next) => {
	ctx.cardsModel = new CardsModel();
	ctx.transactionsModel = new TransactionsModel();

	await next();
});


app.use(bodyParser);
app.use(serve('./public'));
app.use(appRouter.routes());


const listenCallback = function() {
	const {
		port
	} = this.address();

	logger.info(`Application started on ${port}`);
};

const LISTEN_PORT = 3000;

if (!module.parent && process.env.NODE_HTTPS) {
	const protocolSecrets = {
		key: fs.readFileSync('fixtures/key.key'),
		cert: fs.readFileSync('fixtures/cert.crt')
	};

	https
		.createServer(protocolSecrets, app.callback())
		.listen(LISTEN_PORT, listenCallback);
}

if (!module.parent && !process.env.NODE_HTTPS) {
	http
		.createServer(app.callback())
		.listen(LISTEN_PORT, listenCallback);
}

module.exports = app;
