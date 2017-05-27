const term = require('../term.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  const selectWorkflow = require('./select-workflow.js');
  parameters['can-create'] = false;

  const { workflowId, projectId } = await selectWorkflow(parameters);

  await api.deleteWorkflow({ 
    project_id: projectId,
    workflow_id: workflowId
  });

  term('Workflow ').yellow(`#${workflowId}`)(' deleted \n\n');
};

module.exports.help = function() {
  term.brightWhite('delete-workflow')(`
  Delete a workflow
  parameters :   
    ^g[optional] --workflow-id=<id>^: Workflow id
    ^g[optional] --project-id=<id>^:  Project id \n\n`);
};