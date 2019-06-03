const createError = require('http-errors');
const express = require('express');
const router = express.Router();

const Stack = require('../lib/stack.js');
const stack = new Stack();

//Make sure local storage was initialized, before proceeding work with stack
router.use(async function (req, res, next) {
	if(!stack.isStorageInitialized)
		await stack.initStorage();

	next();
});

router.get('/', function(req, res, next) {
	const length = stack.length();

	res.send(`Current stack length is ${length}`);
});

router.get('/pop', async function(req, res, next) {
	const item = await stack.pop();

	if (item)
		res.send(item);
	else
		res.send('Stack is Empty!');
});

router.post('/push', async function(req, res, next) {
	const item = req.body;

	if(await stack.push(item))
		res.send(`Inject item to stack ${JSON.stringify(item)}`);
	else
		res.send(createError(`Error! Cannot inject value of ${item} to stack`));
});
module.exports = router;
