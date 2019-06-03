
if (!process.env.NODE_ENV)
	process.env.NODE_ENV = 'development';

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
	logging: isDevelopment,
	ttl: true // default flag for storage config, equals 24h TTL
};