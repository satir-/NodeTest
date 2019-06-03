const _ = require('lodash');
const storage = require('node-persist');

class TTLStore {

	constructor() {
		this._isStorageInitialized = false;
	}

	async initStorage() {
		const logging = process.env.NODE_ENV === 'development' || false;

		await storage.init({logging});
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

	async set(key, value, ttl = null) {
		if(!this._isStorageInitialized)
			return;

		if (key && value) {
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
