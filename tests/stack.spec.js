jest.mock('node-persist', () => {
	return {
		init: jest.fn(),
		setItem: jest.fn(),
		getItem: jest.fn()
	}
});
const nodePersistMock = require('node-persist');
const Stack = require('../lib/stack.js');
let stack = null;

describe('stack', () => {

	beforeEach(() => {
		stack = new Stack();
	});

	describe('initStorage', () => {
		test('should init storage', async () => {
			const STACK = 'stack';
			const logging = process.env.NODE_ENV === 'development' || false;
			const ttl = true; // default flag, equals 24h TTL

			await stack.initStorage();

			expect(nodePersistMock.init).toHaveBeenCalledWith({logging, ttl});
			expect(nodePersistMock.getItem).toHaveBeenCalledWith(STACK);
			expect(stack._stack).toEqual([]);
			expect(stack.isStorageInitialized).toEqual(true);
		});
	});
	describe('isStorageInitialized', () => {});
	describe('length', () => {});
	describe('pop', () => {});
	describe('push', () => {});
});