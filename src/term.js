const term = require('terminal-kit').terminal;
const { promisifyAll } = require('bluebird');

module.exports = promisifyAll(term);