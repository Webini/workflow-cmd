const term = require('../term.js');
const getParameter = require('../utils/getParameter.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');

  const name = await getParameter(parameters, 'project-name', 'Please enter your new project name', true);
  const project = await api.createProject({ body: { name } });

  term('Project ').bold(project.name)(' created with id ').yellow(`#${project.id}`)('\n\n');
  return project;
};

module.exports.help = function() {
  term.brightWhite('create-project')(`
  Create a new project
  parameters :   
    `).green('[optional] --project-name=<name>')(' Your new project name\n\n');
};