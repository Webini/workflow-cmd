const term = require('../term.js');
const selectWorkflow = require('./select-workflow.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = false;

  await selectWorkflow(parameters);

  term('\nAre you sure ? [Y|n] \n');
  if (parameters.nonInteractive || await term.yesOrNoAsync({ yes: [ 'y', 'Y', 'ENTER' ], no: [ 'n' ] })) {
    await api.deleteWorkflow({ 
      project_id: parameters.projectId,
      workflow_id: parameters.workflowId
    });

    term('Workflow ').yellow(`#${parameters.workflowId}`)(' deleted \n\n');
  } else {
    throw new Error('Cancelled');
  }
};

module.exports.help = function() {
  term.brightWhite('delete-workflow')(`
  Delete a workflow
  parameters :   
    ^g--workflow-id=<id>^: Workflow id
    ^g--project-id=<id>^:  Project id \n\n`);
};