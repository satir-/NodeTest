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

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('initStorage', () => {
		const STACK = 'stack';
		const logging = false;
		const ttl = true;

		test('should init stack with default value', async () => {
			await stack.initStorage();

			expect(nodePersistMock.init).toHaveBeenCalledWith({logging, ttl});
			expect(nodePersistMock.getItem).toHaveBeenCalledWith(STACK);
			expect(stack._stack).toEqual([]);
			expect(stack.isStorageInitialized).toEqual(true);
		});

		test('should init stack with value of the local storage', async () => {
			const storageValue = '{"key":"stack","value":"[]"}';

			nodePersistMock.getItem = jest.fn().mockImplementation(() => storageValue);

			await stack.initStorage();

			expect(nodePersistMock.init).toHaveBeenCalledWith({logging, ttl});
			expect(nodePersistMock.getItem).toHaveBeenCalledWith(STACK);
			expect(stack._stack).toEqual(JSON.parse(storageValue));
			expect(stack.isStorageInitialized).toEqual(true);
		});
	});

	describe('isStorageInitialized', () => {
		test('should return default storage state', () => {
			expect(stack.isStorageInitialized).toEqual(false);
		});

		test('should return initiated storage state', async () => {
			await stack.initStorage();

			expect(stack.isStorageInitialized).toEqual(true);
		});
	});

	describe('length', () => {
		test('should return default stack length', () => {
			let length = stack.length();

			expect(length).toEqual(0);
		});

		test('should return current stack length', async () => {
			await stack.initStorage();
			await stack.push('some_data');

			let length = stack.length();

			expect(length).toEqual(1);
		});
	});

	describe('pop', () => {
		test('should eject last element from the stack', async () => {
			const data = 'some_data';

			await stack.initStorage();
			await stack.push(data);

			expect(await stack.pop()).toEqual(data);
			expect(stack.length()).toEqual(0);
		});

		test('should return undefined value if stack is empty', async () => {
			await stack.initStorage();

			expect(await stack.pop()).toBeUndefined();
			expect(stack.length()).toEqual(0);
		});

		test('should do nothing if storage was not initialized', async () => {
			expect(stack.isStorageInitialized).toEqual(false);
			expect(await stack.pop()).toBeUndefined();
		});
	});

	describe('push', () => {
		test('should push non empty value and return true', async () => {
			await stack.initStorage();

			expect(await stack.push('some_value')).toEqual(true);
			expect(await stack.push(false)).toEqual(true);
			expect(await stack.push(0)).toEqual(true);
			expect(await stack.push(1)).toEqual(true);
			expect(await stack.push(-1)).toEqual(true);
			expect(await stack.push([1])).toEqual(true);
			expect(await stack.push({'key':'value'})).toEqual(true);
		});

		test('should push falsy value and return false', async () => {
			await stack.initStorage();

			expect(await stack.push('')).toEqual(false);
			expect(await stack.push(undefined)).toEqual(false);
			expect(await stack.push(null)).toEqual(false);
			expect(await stack.push(NaN)).toEqual(false);
			expect(await stack.push([])).toEqual(false);
			expect(await stack.push({})).toEqual(false);
		});

		test('should do nothing if storage was not initialized', async () => {
			expect(stack.isStorageInitialized).toEqual(false);
			expect(await stack.push('value')).toBeUndefined();
		});
	});
});