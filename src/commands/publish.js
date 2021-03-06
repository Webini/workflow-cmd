const term = require('../term.js');
const package = require('../../package.json');
const getParameter = require('../utils/getParameter.js');
const selectParameter = require('../utils/selectParameter.js');
const selectProject = require('./select-project.js');
const Workflow = require('../utils/workflow.js');
const path = require('path');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = true;
  
  const file = parameters.workflowFile || path.join(process.cwd(), `${package.name}.json`);
  const workflow = Workflow.open(file);
  await selectProject(parameters);

  const { data: workflows } = await api.getWorkflows({
    project_id: parameters.projectId, 
    body: {
      name: workflow.getName()
    }
  });

  let workflowId = null;
  if (workflows.length === 1) {
    let replace = parameters.forceReplace;
    if (!replace && !parameters.nonInteractive) {
      term('\nWorkflow already exists, replace it ? [y|N]\n');
      replace = await term.yesOrNoAsync({ yes: [ 'y' ], no: [ 'n', 'N', 'ENTER' ] });
    }
    
    if(replace) {
      workflowId = workflows[0].id;
    } else {
      throw new Error('Please, rename your workflow');
    }
  }

  const apiMethod = (workflowId ? api.updateWorkflow : api.createWorkflow).bind(api);
  const result = await apiMethod({
    project_id: parameters.projectId,
    workflow_id: workflowId,
    body: workflow.normalizeForServer()
  });

  term(`\nWorkflow ^b${workflow.getName()}^: ${workflowId ? 'updated' : 'created'}\n`);
  term('Url : ').green(`${api.URL}/hook/${result.guid}\n\n`);

  return result;
};

module.exports.help = function() {
  term.brightWhite('publish')(`
  Send workflow to the server
  parameters :
    ^g--workflow-file=<file>: Worfklow json file
    ^g--project-id=<id>^:     Project id\n
    ^g--force-replace         Replace workflow if already present\n\n`);
};