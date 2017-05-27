const term = require('../term.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  const selectProject = require('./select-project.js');
  parameters['can-create'] = false;

  const projectId = (await selectProject(parameters));

  const { count, data: workflows }  = await api.searchWorkflows({ 
    project_id: projectId,
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
    ^g[optional] --project-id=<id>^:      Project id \n\n`);
};