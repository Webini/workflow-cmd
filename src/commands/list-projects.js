const term = require('../term.js');

module.exports = async function() {
  const api = require('../api.js');
  const { count, data: projects }  = await api.searchProjects({ body: { limit: 50 } });
  term(`\n${count} project(s) found\n\n`);

  projects.forEach((project) => {
    term.yellow(`#${project.id}`).bold(` ${project.name}`)('\n');
  });
  term('\n');
};

module.exports.help = function() {
  term.brightWhite('list-projects')('\n  list all projects\n\n');
};