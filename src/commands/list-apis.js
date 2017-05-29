const term = require('../term.js');
const selectProject = require('./select-project.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = false;
  
  await selectProject(parameters);

  const { count, data: apis }  = await api.searchApi({ 
    project_id: parameters.projectId,
    body: { limit: 50 } 
  });

  term(`\n${count} api(s) found\n\n`);

  apis.forEach((api) => {
    term.yellow(`#${api.id}`).bold(` ${api.name}`)(`
  Host: ${api.host}
  Headers:`);
    Object
      .keys(api.headers || {})
      .forEach((name) => {
        term(`
    ${name}: ${api.headers[name]}`);
      })
    ;

    term(`
  Query string : `);
    Object
      .keys(api.qs || {})
      .forEach((name) => {
        term(`
    ${name}: ${api.qs[name]}`);
      })
    ;

    term('\n');
  });

  term('\n');
};

module.exports.help = function() {
  term.brightWhite('list-apis')(`
  List all project's apis
  parameters :   
    ^g--project-id=<id>^:      Project id \n\n`);
};