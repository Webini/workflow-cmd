const term = require('../term.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  const selectProject = require('./select-project.js');
  parameters['can-create'] = false;

  const projectId = await selectProject(parameters);

  await api.deleteProject({ 
    project_id: projectId
  });

  term('Project ').yellow(`#${projectId}`)(' deleted \n\n');
};

module.exports.help = function() {
  term.brightWhite('delete-project')(`
  delete project
  parameters :   
    `).green('[optional] --project-id=<id>')(' project id\n\n');
};