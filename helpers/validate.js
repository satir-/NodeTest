const _ = require('lodash');

// Validate input for non-empty values (arrays and objects included)
function validateInput(data) {
	if(_.isArray(data) || _.isObject(data))
		return !_.isEmpty(data);
	else
		return data || data === 0 || _.isBoolean(data);
}

module.exports = {
	validateInput: validateInput
};