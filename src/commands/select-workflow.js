const term = require('../term.js');
const selectProject = require('./select-project.js');
const createWorkflow = require('./create-workflow.js');

module.exports = async function(parameters = { canCreate: true }) {
  const api = require('../api.js');
  const canCreate = !!parameters.canCreate;

  await selectProject(parameters);

  if (parameters.workflowId) {
    return parameters.workflowId;
  } 

  const { count, data: workflows }  = await api.searchWorkflows({ 
    project_id: parameters.projectId,
    body: { limit: 50 } 
  });
  term('\nSelect workflow\n');
  term(`${count} workflow(s) found\n`);

  const options = workflows.map((workflow) => `#${workflow.id} : ${workflow.name||'No name'}\n`);
  if (canCreate) {
    options.push('New workflow ');
  }
  options.push('Cancel');

  const result = await term.singleColumnMenuAsync(options);
  
  term('\n');
  
  if (result.selectedIndex === workflows.length && canCreate) {
    parameters.workflowId = (await createWorkflow(parameters)).id;
  } else if(result.selectedIndex === workflows.length + (canCreate ? 1 : 0)) {
    throw new Error('Cancelled');
  } else {
    parameters.workflowId = workflows[result.selectedIndex].id;
  }

  return parameters.workflowId;
};

module.exports.private = true;