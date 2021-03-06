const term = require('../term.js');
const selectProject = require('./select-project.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = false;

  await selectProject(parameters);

  const { count, data: workflows }  = await api.searchWorkflows({ 
    project_id: parameters.projectId,
    body: { limit: 50 } 
  });

  term(`\n${count} workflow(s) found\n\n`);

  workflows.forEach((workflow) => {
    term.yellow(`#${workflow.id}`).bold(` ${workflow.name}`)('\n');
  });

  term('\n');
};

module.exports.help = function() {
  term.brightWhite('list-workflows')(`
  List all project's workflow
  parameters :   
    ^g--project-id=<id>^:      Project id \n\n`);
};