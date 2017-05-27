const term = require('../term.js');
const selectProject = require('./select-project.js');

module.exports = async function(parameters = { 'can-create': true }) {
  const api = require('../api.js');
  const createApi = require('./create-api.js');
  const canCreate = !!parameters.canCreate;

  await selectProject(parameters);

  if (parameters.apiId) {
    return parameters.apiId;
  }

  const { count, data: apis }  = await api.searchApi({ 
    project_id: parameters.projectId,
    body: { limit: 50 } 
  });
  term('\nSelect api\n');
  term(`${count} api(s) found\n`);

  const options = apis.map((api) => `#${api.id} : ${api.name||'No name'}\n`);
  if (canCreate) {
    options.push('New api');
  }
  options.push('Cancel');

  const result = await term.singleColumnMenuAsync(options);
  
  term('\n');
  
  if (result.selectedIndex === apis.length && canCreate) {
    parameters.apiId = (await createApi(parameters)).id;
  } else if(result.selectedIndex === apis.length + (canCreate ? 1 : 0)) {
    throw new Error('Cancelled');
  } else {
    parameters.apiId = apis[result.selectedIndex].id;
  }
  return parameters.apiId;
};

module.exports.private = true;