const term = require('../term.js');

module.exports = async function(parameters = { 'can-create': true }) {
  const api = require('../api.js');
  const createProject = require('./create-project.js');
  const canCreate = !!parameters['can-create'];

  if (parameters['project-id']) {
    return parameters['project-id'];
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
    return (await createProject()).id; 
  } else if(result.selectedIndex === projects.length + (canCreate ? 1 : 0)) {
    throw new Error('Cancelled');
  } else {
    return projects[result.selectedIndex].id;
  }
};

module.exports.private = true;