const term = require('../term.js');
const getParameter = require('../utils/getParameter.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  const selectProject = require('./select-project.js');

  const projectId = await selectProject(parameters);
  const name = await getParameter(parameters, 'workflow-name', 'Please enter your worlkflow name', true);
  
  const workflow = await api.createWorkflow({ 
    project_id: projectId, 
    body: { name } 
  });

  term(`workflow ^b${workflow.name}^: created with id ^y#${workflow.id}\n\n`);
  return workflow;
};

module.exports.help = function() {
  term.brightWhite('create-workflow')(`
  Create a new workflow
  parameters :   
    ^g[optional] --workflow-name=<name>^: Your new workflow name
    ^g[optional] --project-id=<id>^:      Project id \n\n`);
};