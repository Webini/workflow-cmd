const ApiWrapper = require('./apiWrapper.js');
const apikey = require('./apikey.js');

module.exports = new ApiWrapper(apikey.get()); 