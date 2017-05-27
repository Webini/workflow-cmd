const term = require('../term.js');
const createProject = require('./create-project.js');

module.exports = async function(parameters = { canCreate: true }) {
  const api = require('../api.js');
  const canCreate = !!parameters.canCreate;

  if (parameters.projectId) {
    return parameters.projectId;
  }

  const { count, data: projects }  = await api.searchProjects({ body: { limit: 50 } });
  term('\nSelect a project\n');
  term(`${count} project(s) found\n`);

  const options = projects.map((project) => `#${project.id} : ${project.name||'No name'}\n`);
  if (canCreate) {
    options.push('New project ');
  }
  options.push('Cancel');

  const result = await term.singleColumnMenuAsync(options);
  
  term('\n');
  
  if (result.selectedIndex === projects.length && canCreate) {
    parameters.projectId = (await createProject()).id; 
  } else if(result.selectedIndex === projects.length + (canCreate ? 1 : 0)) {
    throw new Error('Cancelled');
  } else {
    parameters.projectId = projects[result.selectedIndex].id;
  }

  return parameters.projectId;
};

module.exports.private = true;