const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const TTLStore = require('../lib/ttl-store.js');
const ttlStore = new TTLStore();

// Payload keys contract
const KEY = 'key';
const VALUE = 'value';
const TTL = 'ttl';

//Make sure local storage was initialized, before proceeding work with TTL Store
router.use(async function (req, res, next) {
	if(!ttlStore.isStorageInitialized)
		await ttlStore.initStorage();

	next();
});

router.get('/', function(req, res, next) {
	res.send(`Default TTL Store route. Please use GET, POST or DELETE to operate with storage`);
});

router.get('/:' + KEY, async function(req, res, next) {
	const key = req.params[KEY];

	const item = await ttlStore.get(key);

	if (item)
		res.send(item);
	else
		res.send(`No data were found by the key: ${key}`);
});

router.post('/', async function(req, res, next) {
	const payload = req.body;
	const key = payload[KEY];
	const value = payload[VALUE];
	const ttl = parseInt(payload[TTL]);

	const result = await ttlStore.set(key, value, ttl);

	if(result)
		res.send(`Set a value to TTL Store ${JSON.stringify(value)} by the key ${key} ${ttl ? 'with TTL '+ttl : ''}`);
	else
		res.send(createError(`Error! Cannot inject value of ${value} with a key ${key} to TTL Store`));
});

router.delete('/:' + KEY, async function(req, res, next) {
	const key = req.params[KEY];

	const result = await ttlStore.delete(key);

	if(result.removed)
		res.send(`Deleted item from TTL Store by the key: ${JSON.stringify(key)}`);
	else if (!result.existed)
		res.send(createError(`Error! Cannot delete value by the key ${key} from TTL Store, because it doesn't exist`));
	else
		res.send(createError(`Error! Cannot delete value by the key ${key} from TTL Store`));
});
module.exports = router;
