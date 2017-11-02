'use strict';

const jest = require('jest');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../../../../source/app.js');

const dbModel = require('../../../../source/models/common/dbModel');
const Error = require('../../../../source/controllers/error');

/////////////////////////////////////////////////////////////////////////

//jest.mock('../../../source/controllers/error');

const sandbox = sinon.sandbox.create();


const DATA = {cardNumber: '1234567812345779', balance: 1000};
const TRYDATA = {id: 4, cardNumber: '1234567812345779', balance: 1000};
const CARDS = [
	{
		"id": 1,
		"cardNumber": "4701270410000005",
		"balance": 4334
	},
	{
		"id": 2,
		"cardNumber": "4093560410000024",
		"balance": 7434
	},
	{
		"id": 3,
		"cardNumber": "5469250410000042",
		"balance": 7850
	}
];


sandbox.stub(dbModel.prototype, 'getAll').callsFake(function getAll() {
	return CARDS;
});


sandbox.stub(dbModel.prototype, '_generateId').callsFake(function _generateId() {
	return 4;
});

sandbox.stub(dbModel.prototype, '_insert').callsFake(function _insert() {
	return TRYDATA;
});



const server = app.listen();

////////////////////////////////////////////////////////////////

test('Test get card controller', async () => {
	const response = await supertest(server)
		.get('/cards/');
	expect(response.statusCode).toBe(200);
	expect(response.body).toEqual(CARDS);
});


test('Test post card controller', async () => {
	const response = await supertest(server)
		.post('/cards/')
		.set('Accept', 'application/json')
		.send(DATA);
	expect(response.statusCode).toBe(201);
	expect(response.body).toEqual(TRYDATA);
});


//////////////////////////////////////////////////////////////////

server.close();
