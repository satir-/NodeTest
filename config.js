
if (!process.env.NODE_ENV)
	process.env.NODE_ENV = 'development';

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
	logging: isDevelopment
};