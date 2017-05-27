const term = require('../term.js');
const getParameter = require('../utils/getParameter.js');
const selectParameter = require('../utils/selectParameter.js');
const selectWorkflow = require('./select-workflow.js');
const lambdaOptions = {
  'api': require('./item/get-api.js'),
  'lambda': require('./item/get-lambda.js')
};

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = true;
  
  await selectWorkflow(parameters);

  const label = await getParameter({
    parameters, 
    name: 'itemLabel', 
    label: 'Please enter your item label'
  });

  const type = await selectParameter({ 
    parameters,
    name: 'type',
    label: 'Select type',
    choices: Object.keys(lambdaOptions)
  });

  const body = await lambdaOptions[type](parameters);

  const item = await api.createItem({ 
    project_id: parameters.projectId, 
    workflow_id: parameters.workflowId,
    body: Object.assign({ label, type }, body)
  });

  term(`\nItem ^b${item.label}^: of type ^b${item.type}^: created with id ^y#${item.id}\n\n`);
  return item;
};

module.exports.help = function() {
  term.brightWhite('create-item')(`
  Create a new workflow item
  parameters :   
    ^g--item-label=<label>^: You new item label 
    ^g--workflow-id=<id>^:   Workflow id
    ^g--project-id=<id>^:    Project id 
    ^g--type=<${Object.keys(lambdaOptions)}>^:  Item type \n`);

  Object.keys(lambdaOptions).map((key) => {
    term(`
    type ${key} \n`);

    lambdaOptions[key].help();
  });
  term('\n');
};