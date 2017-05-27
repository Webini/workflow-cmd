const term = require('../term.js');
const selectApi = require('./select-api.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = false;

  await selectApi(parameters);
  
  term('\nAre you sure ? [Y|n] \n');
  if (parameters.nonInteractive || await term.yesOrNoAsync({ yes: [ 'y', 'Y', 'ENTER' ], no: [ 'n' ] })) {
    await api.deleteApi({ 
      project_id: parameters.projectId,
      api_id: parameters.apiId
    });

    term('Api ').yellow(`#${parameters.apiId}`)(' deleted \n\n');
  } else {
    throw new Error('Cancelled');
  }
};

module.exports.help = function() {
  term.brightWhite('delete-api')(`
  Delete an api
  parameters :   
    ^g--api-id=<id>^:      Api id
    ^g--project-id=<id>^:  Project id \n\n`);
};