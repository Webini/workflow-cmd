const term = require('../term.js');
const apikey = require('../apikey.js');

module.exports = async function(parameters) {
  if (!parameters['api-key']) {
    term.white('Please enter your api key : ');
    parameters['api-key'] = await term.inputFieldAsync();
    term('\n');
  }
  apikey.set(parameters['api-key']);
  term('Api key saved\n');
};

module.exports.help = function() {
  term.brightWhite('configure')(`
  configure this computer with your token
  parameters :   
    `).green('--api-key=<apiKey>')(' Your api key\n\n');
};