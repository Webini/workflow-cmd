const term = require('../term.js');
const selectWorkflow = require('./select-workflow.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = false;

  await selectWorkflow(parameters);

  const { count, data: items }  = await api.searchItems({ 
    project_id: parameters.projectId,
    workflow_id: parameters.workflowId,
    body: {
      orderField: 'order',
      orderDir: 'ASC',
      limit: 50 
    } 
  });

  term(`\n${count} items(s) found\n\n`);

  items.forEach((item) => {
    term.blue(`${item.order}.`).yellow(` #${item.id}`)(` [${item.type}]`).bold(` ${item.label}`)('\n');
  });

  term('\n');
};

module.exports.help = function() {
  term.brightWhite('list-items')(`
  List all workflow's item
  parameters :   
    ^g--project-id=<id>^:      Project id 
    ^g--workflow-id=<id>^:     Workflow id\n\n`);
};