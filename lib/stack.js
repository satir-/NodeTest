const _ = require('lodash');
const storage = require('node-persist');

const STACK = 'stack';

class Stack {

	constructor() {
		this._stack = [];
		this._isStorageInitialized = false;
	}

	async initStorage() {
		const logging = process.env.NODE_ENV === 'development' || false;
		const ttl = true; // default flag, equals 24h TTL

		await storage.init({logging, ttl});

		const result = await storage.getItem(STACK);
		if (result)
			this._stack = JSON.parse(result);
		else
			this._stack = [];
		this._isStorageInitialized = true;
	}

	get isStorageInitialized() {
		return this._isStorageInitialized;
	}

	length() {
		return this._stack.length;
	}

	async pop() {
		if (!this._isStorageInitialized)
			return;

		const item = this._stack.pop();
		await storageUpdate(this._stack);

		return item;
	}

	async push(data) {
		if (!this._isStorageInitialized)
			return;

		if (validateInput(data)) {
			this._stack.push(data);
			await storageUpdate(this._stack);

			return true;
		} else
			return false;
	}
}

module.exports = Stack;

async function storageUpdate(data) {
	await storage.setItem(STACK, JSON.stringify(data));
}

function validateInput(data) {
	if(_.isArray(data) || _.isObject(data))
		return !_.isEmpty(data);
	else
		return data || data === 0 || _.isBoolean(data);
}