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

	describe('isStorageInitialized', () => {});
	describe('get', () => {});
	describe('set', () => {});
	describe('delete', () => {});
});