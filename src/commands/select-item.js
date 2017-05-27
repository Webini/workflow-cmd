const term = require('../term.js');
const selectWorkflow = require('./select-workflow.js');
const createItem = require('./create-item.js');

module.exports = async function(parameters = { 'can-create': true }) {
  const api = require('../api.js');
  const canCreate = !!parameters.canCreate;

  await selectWorkflow(parameters); 

  if (parameters.itemId) {
    return parameters.itemId;
  } 

  const { count, data: items }  = await api.searchItems({ 
    project_id: parameters.projectId,
    workflow_id: parameters.workflowId,
    body: { limit: 50 } 
  });
  term('\nSelect item\n');
  term(`${count} item(s) found\n`);

  const options = items.map((item) => `${item.order}. #${item.id} [${item.type}] ${item.label||'No name'}\n`);
  if (canCreate) {
    options.push('New item');
  }
  options.push('Cancel');

  const result = await term.singleColumnMenuAsync(options);
  
  term('\n');
  
  if (result.selectedIndex === items.length && canCreate) {
    parameters.itemId = (await createItem(parameters)).id;
  } else if(result.selectedIndex === items.length + (canCreate ? 1 : 0)) {
    throw new Error('Cancelled');
  } else {
    parameters.itemId = items[result.selectedIndex].id;
  }

  return parameters.itemId;
};

module.exports.private = true;