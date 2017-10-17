const term = require('../term.js');
const selectMessage = require('./select-message.js');
const path = require('path');
const fs = require('fs');
const Workflow = require('../utils/workflow.js');
const selectProject = require('./select-project.js');
const package = require('../../package.json');
const executeWorkflow = require('../utils/executeWorkflow.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = false;
  
  const file = parameters.workflowFile || path.join(process.cwd(), `${package.name}.json`);
  const workflow = Workflow.open(file);
  await selectProject(parameters);

  const { data: serverWorkflows } = await api.getWorkflows({
    project_id: parameters.projectId, 
    body: {
      name: workflow.getName()
    }
  });

  if (serverWorkflows.length === 1) {
    parameters.workflowId = serverWorkflows[0].id;
  }

  await selectMessage(parameters);

  const message = await api.getMessage({ 
    project_id: parameters.projectId,
    workflow_id: parameters.workflowId,
    message_id: parameters.messageId
  });

  const workflowData = workflow.normalizeForServer();
  workflowData.project_id = parameters.projectId;
  
  const result = await executeWorkflow(message.content, workflowData);
  term.brightWhite('Result : ');
  console.log(result);
};

module.exports.help = function() {
  term.brightWhite('debug')(`
  Debug your workflow with an existing message
  parameters :   
    ^g--workflow-file=<file>:    Worfklow json file
    ^g--project-id=<id>^:        Project id 
    ^g--workflow-id=<id>^:       Workflow id
    ^g--message-id=<id>^:        Message id\n\n`);
};