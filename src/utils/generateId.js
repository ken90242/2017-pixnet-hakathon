const sha256 = require('js-sha256').sha256;

module.exports = () => {
	return sha256(Math.random().toString());
};
