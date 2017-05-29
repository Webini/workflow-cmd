const term = require('../term.js');
const selectMessage = require('./select-message.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = false;

  await selectMessage(parameters);

  const message = await api.updateMessage({ 
    project_id: parameters.projectId,
    workflow_id: parameters.workflowId,
    message_id: parameters.messageId,
    body: {
      requeue: true
    }
  });

  term(`\nMessage ${message.id} requeued\n\n`);
};

module.exports.help = function() {
  term.brightWhite('requeue')(`
  Requeue message
  parameters :   
    ^g--project-id=<id>^:        Project id 
    ^g--workflow-id=<id>^:       Workflow id
    ^g--message-id=<id>^:        Message id\n\n`);
};