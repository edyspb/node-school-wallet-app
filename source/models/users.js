'use strict';

const ApplicationError = require('libs/application-error');

const DbModel = require('./common/dbModel');

class Users extends DbModel {
	constructor() {
		super('user');
	}

	async create(user) {
		const newUser = Object.assign({}, user);

		await this._insert(newUser);
		return newUser;
	}

	async getById(id) {
		const user = await this.getByAll({id});
		return user;
	}

	async findOrCreate(userData) {
		let user = await this.get(userData.id);

		console.log('user1111', user);

		if (user) {
			console.log('out');
			return user;
		}
		user = await this.create(userData);

		console.log('Createduser', user);
		return user;
	}

	/**
	 * Удаление транзакции
	 */
	static async remove() {
		throw new ApplicationError('User can\'t be removed', 400);
	}
}

module.exports = Users;
