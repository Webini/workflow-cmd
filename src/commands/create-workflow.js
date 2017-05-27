const term = require('../term.js');
const getParameter = require('../utils/getParameter.js');
const selectProject = require('./select-project.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = true;

  await selectProject(parameters);

  const name = await getParameter({
    parameters, 
    name: 'workflowName', 
    label: 'Please enter your worlkflow name'
  });
  
  const workflow = await api.createWorkflow({ 
    project_id: parameters.projectId, 
    body: { name } 
  });

  term(`workflow ^b${workflow.name}^: created with id ^y#${workflow.id}\n\n`);
  return workflow;
};

module.exports.help = function() {
  term.brightWhite('create-workflow')(`
  Create a new workflow
  parameters :   
    ^g--workflow-name=<name>^: Your new workflow name
    ^g--project-id=<id>^:      Project id \n\n`);
};