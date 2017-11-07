'use strict';

const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const axios = require('axios');
const getRouter = require('koa-router');
const cookie = require('koa-cookie');
const bodyParser = require('koa-bodyparser')();
const querystring = require('querystring');

const logger = require('libs/logger')('app');

const {renderToStaticMarkup} = require('react-dom/server');

const getCardsController = require('./controllers/cards/get-cards');
const isAuthenticated = require('./controllers/authentication/isAuthenticated');
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
const UsersModel = require('source/models/users');

const getTransactionsController = require('./controllers/transactions/get-transactions');

const getReport = require('./service/getReport');

const yandexOAuth = {
	client_id: '3b8a4438962941d68d286f15fdeaacc2',
	client_secret: '041ea88829ab48ecb4210188d4ee2ffa',
};

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/yandexdb';
mongoose.connect(MONGODB_URI, { useMongoClient: true });
mongoose.Promise = global.Promise;

const app = new Koa();
const appRouter = getRouter();
const clientRouter = getRouter();
const apiRouter = getRouter();
const authRouter = getRouter();

function getView(viewId) {
	const viewPath = path.resolve(__dirname, 'views', `${viewId}.server.js`);
	delete require.cache[require.resolve(viewPath)];
	return require(viewPath);
}

async function getData(ctx) {
	const data = await isAuthenticated(ctx);
	data.cards = [];
	data.transactions = [];
	if (data.isAuthenticated) {
		//data.cards = await ctx.cardsModel.getAll();
		//data.transactions = await ctx.transactionsModel.getAll();

		data.cards = await ctx.cardsModel.getByAll({userId: data.user.id});
		data.transactions = await ctx.transactionsModel.getByAll({userId: data.user.id});
	}

	return data;
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
apiRouter.get('/report/:id', getReport);
authRouter.get('/auth', async (ctx) => {
	const codeForToken = ctx.originalUrl.replace('/api/yandex/auth?code=', '');

	let accessToken;

	// console.log('authApp', authApp);
	await axios.post('https://oauth.yandex.ru/token', querystring.stringify({
		grant_type: 'authorization_code',
		code: codeForToken,
		client_secret: yandexOAuth.client_secret,
		client_id: yandexOAuth.client_id,
	})).then((answer) => {
		accessToken = answer.data.access_token;
	}).catch((err) => {
		console.log('err', err);
	});


	if (accessToken === undefined) {
		ctx.redirect('/');
	}

    let userBio;
	await axios.get('https://login.yandex.ru/info?format=json&with_openid_identity=1',
	{ headers: { Authorization: `OAuth ${accessToken}`}}).then((answer) => {
		userBio = answer.data;
	}).catch((err) => {
		console.log('err', err);
	});


	if (userBio) {
		await ctx.usersModel.findOrCreate(userBio);
		ctx.cookies.set('accessToken', accessToken, {httpOnly: false});
		ctx.redirect('/workspace');
	} else {
		ctx.redirect('/');
	}
});

apiRouter.post('/isAuthenticated', isAuthenticated);

apiRouter.all('/error', errorController);

// inizialize routes
appRouter.use('/api/yandex', authRouter.routes());

appRouter.use('/api/v1', async (ctx, next) => {
	const authData = await isAuthenticated(ctx);
	if (!authData.isAuthenticated) {
		ctx.status = 403;
		ctx.body = 'Access denied :(';
	} else {
		ctx.authData = authData;
		await next();
	}
}, apiRouter.routes());

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
	ctx.usersModel = new UsersModel();

	await next();
});


app.use(cookie.default());
app.use(bodyParser);
app.use(serve('./public'));
app.use(appRouter.routes());


const listenCallback = function() {
	const {
		port
	} = this.address();

	logger.info(`Application started on ${port}`);
};

const LISTEN_PORT = process.env.PORT || 3000;

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
