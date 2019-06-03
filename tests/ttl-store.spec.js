jest.mock('node-persist', () => {
	return {
		init: jest.fn(),
		setItem: jest.fn(),
		getItem: jest.fn(),
		removeItem: jest.fn()
	}
});
const nodePersistMock = require('node-persist');
const TTLStore = require('../lib/ttl-store.js');

let ttlStore = null;

describe('ttl-store', () => {

	beforeEach(() => {
		ttlStore = new TTLStore();
	});

	describe('initStorage', () => {
		test('should init storage', async () => {
			const logging = process.env.NODE_ENV === 'development' || false;

			await ttlStore.initStorage();

			expect(nodePersistMock.init).toHaveBeenCalledWith({logging});
			expect(ttlStore.isStorageInitialized).toEqual(true);
		});
	});


	describe('isStorageInitialized', () => {
		test('should return default storage state', () => {
			expect(ttlStore.isStorageInitialized).toEqual(false);
		});

		test('should return initiated storage state', async () => {
			await ttlStore.initStorage();

			expect(ttlStore.isStorageInitialized).toEqual(true);
		});
	});

	describe('get', () => {
		const key = 'key';
		const value = 'some_value';
		const storageValue = {[key]: value};

		nodePersistMock.getItem = jest.fn().mockImplementation((key) => storageValue[key]);

		test('should get value by the key', async () => {
			await ttlStore.initStorage();

			expect(await ttlStore.get(key)).toEqual(value);
			expect(nodePersistMock.getItem).toHaveBeenCalledWith(key);
		});

		test('should return undefined if there are no key was found', async () => {
			const non_existing_key = 'other_key';

			await ttlStore.initStorage();

			expect(await ttlStore.get(non_existing_key)).toBeUndefined();
			expect(nodePersistMock.getItem).toHaveBeenCalledWith(non_existing_key);
		});

		test('should return false if there are no key was provided', async () => {
			await ttlStore.initStorage();

			expect(await ttlStore.get()).toEqual(false);
			expect(nodePersistMock.getItem).not.toHaveBeenCalled();
		});

		test('should do nothing if storage was not initialized', async () => {
			expect(ttlStore.isStorageInitialized).toEqual(false);
			expect(await ttlStore.get('key')).toBeUndefined();
		});
	});

	describe('set', () => {
		const key = 'key';
		const value = 'some_value';
		const default_ttl = null;

		nodePersistMock.setItem = jest.fn().mockImplementation((key, value, options) => {
			return {key, value, ttl: options.ttl};
		});

		test('should set value by the key with default ttl and return saved object', async () => {
			const storageValue = {key, value, ttl: default_ttl};
			const options = {ttl: default_ttl};

			await ttlStore.initStorage();

			expect(await ttlStore.set(key, value)).toEqual(storageValue);
			expect(nodePersistMock.setItem).toHaveBeenCalledWith(key, value, options);
		});

		test('should set value by the key with specified ttl and return saved object', async () => {
			const ttl = 1000;
			const storageValue = {key, value, ttl};
			const options = {ttl: ttl};

			await ttlStore.initStorage();

			expect(await ttlStore.set(key, value, ttl)).toEqual(storageValue);
			expect(nodePersistMock.setItem).toHaveBeenCalledWith(key, value, options);
		});

		test('should return false if there are no key or value were provided', async () => {
			await ttlStore.initStorage();

			expect(await ttlStore.set(key)).toEqual(false);
			expect(nodePersistMock.getItem).not.toHaveBeenCalled();

			expect(await ttlStore.set('', value)).toEqual(false);
			expect(nodePersistMock.getItem).not.toHaveBeenCalled();

			expect(await ttlStore.set()).toEqual(false);
			expect(nodePersistMock.getItem).not.toHaveBeenCalled();
		});

		test('should do nothing if storage was not initialized', async () => {
			expect(ttlStore.isStorageInitialized).toEqual(false);
			expect(await ttlStore.set('key', 'value')).toBeUndefined();
		});
	});

	describe('delete', () => {
		const key = 'key';
		const value = 'some_value';
		const storageValue = {[key]: value};
		const result_success = {removed: true, existed: true, file: 'some_path_to_file'};
		const result_fail = {removed: false, existed: false, ...result_success};

		nodePersistMock.removeItem = jest.fn().mockImplementation((key) => {
			if (storageValue[key])
				return result_success;
			else
				return result_fail;
		});

		test('should remove value by the key and return result', async () => {
			await ttlStore.initStorage();

			expect(await ttlStore.delete(key)).toEqual(result_success);
			expect(nodePersistMock.removeItem).toHaveBeenCalledWith(key);
		});

		test('should fail to remove value by the key if there is no key was found and return result', async () => {
			const non_existing_key = 'other_key';

			await ttlStore.initStorage();

			expect(await ttlStore.delete(non_existing_key)).toEqual(result_fail);
			expect(nodePersistMock.removeItem).toHaveBeenCalledWith(non_existing_key);
		});

		test('should return false if there are no key was provided', async () => {
			await ttlStore.initStorage();

			expect(await ttlStore.delete()).toEqual(false);
			expect(nodePersistMock.removeItem).not.toHaveBeenCalled();
		});

		test('should do nothing if storage was not initialized', async () => {
			expect(ttlStore.isStorageInitialized).toEqual(false);
			expect(await ttlStore.delete('key')).toBeUndefined();
		});
	});
});