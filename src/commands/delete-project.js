const term = require('../term.js');
const selectProject = require('./select-project.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = false;

  const projectId = await selectProject(parameters);

  term('\nAre you sure ? [Y|n] \n');
  if (parameters.nonInteractive || await term.yesOrNoAsync({ yes: [ 'y', 'Y', 'ENTER' ], no: [ 'n' ] })) {
    await api.deleteProject({ 
      project_id: projectId
    });

    term('Project ').yellow(`#${projectId}`)(' deleted \n\n');
  } else {
    throw new Error('Cancelled');
  }
};

module.exports.help = function() {
  term.brightWhite('delete-project')(`
  delete project
  parameters :
    ^g--project-id=<id>^:  project id\n\n`);
};