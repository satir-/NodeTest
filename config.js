
if (typeof process.env.NODE_ENV === 'undefined')
	process.env.NODE_ENV = 'development';

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
	logging: isDevelopment
};