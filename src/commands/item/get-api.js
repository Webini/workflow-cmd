const term = require('../../term.js');
const selectApi = require('../select-api.js');
const selectParameter = require('../../utils/selectParameter.js');
const getParameter = require('../../utils/getParameter.js');

module.exports = async function(parameters = {}) {
  const api = require('../../api.js');
  parameters.canCreate = true;
  await selectApi(parameters);
  
  const endpoint = await getParameter({ 
    parameters, 
    name: 'apiEndpoint', 
    label: 'Please enter the api endpoint' 
  });
  const method = await selectParameter({ 
    parameters, 
    name: 'apiMethod', 
    label: 'Please enter your api method',
    choices: [ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'CONNECT', 'OPTIONS', 'TRACE' ] 
  });

  const apiData = await api.getApi({ 
    project_id: parameters.projectId, 
    api_id: parameters.apiId 
  });

  return { 
    name: apiData.name,
    configuration: {
      endpoint, method 
    }
  };
};

module.exports.help = function() {
  term(
`      ^g --api-id=<id>^:                    api id 
      ^g --api-endpoint=</get/:custom_id>^: api endpoint\n`);
};