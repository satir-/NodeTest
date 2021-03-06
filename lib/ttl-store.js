const storage = require('node-persist');

const config = require('../config');
const validator = require('../helpers/validate');

class TTLStore {

	constructor() {
		this._isStorageInitialized = false;
	}

	async initStorage() {
		await storage.init({
			logging: config.logging,
			ttl: config.ttl
		});
		this._isStorageInitialized = true;
	}

	get isStorageInitialized() {
		return this._isStorageInitialized;
	}

	async get(key) {
		if(!this._isStorageInitialized)
			return;

		if (key)
			return await storage.getItem(key);
		else
			return false;
	}

	async set(key, value, ttl) {
		if(!this._isStorageInitialized)
			return;

		if (key && validator.validateInput(value)) {
			return await storage.setItem(key, value, {ttl: ttl});
		} else
			return false;
	}

	async delete(key) {
		if(!this._isStorageInitialized)
			return;

		if (key) {
			return await storage.removeItem(key);
		} else
			return false;
	}
}
module.exports = TTLStore;
