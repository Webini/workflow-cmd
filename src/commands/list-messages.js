const term = require('../term.js');
const selectWorkflow = require('./select-workflow.js');
const status = require('../utils/status.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = false;

  await selectWorkflow(parameters);

  const body = {
    limit: parameters.limit || 50,
    order_field: 'updated_at', 
    order_dir: 'DESC',
  };

  if (parameters.messageId) {
    body.id = parameters.messageId;
  }

  if (parameters.status) {
    body.status = status[parameters.status.toLowerCase()];
    if (!body.status) {
      throw new Error(`Invalid status use ${Object.keys(status.kv).join(', ')}`);
    }
  }

  const { count, data: messages }  = await api.searchMessages({ 
    project_id: parameters.projectId,
    workflow_id: parameters.workflowId,
    body
  });

  term(`\n${count} message(s) found\n\n`);

  messages.forEach((message) => {
    term.yellow(`# ${message.id}`).bold(` ${status.vk[message.status]}`);
    if (message.error && message.status === status.kv.error) {
      term.red(` ${message.error}`);
    }
    term.gray(` (${new Date(message.updated_at)})\n`);
  });

  term('\n');
};

module.exports.help = function() {
  term.brightWhite('list-messages')(`
  List all project's workflow
  parameters :   
    ^g--project-id=<id>^:      Project id 
    ^g--workflow-id=<id>^:     Workflow id
    ^g--status=<${Object.keys(status.kv).join(', ')}>^: Message status
    ^g--message-id=<id>^:      Message id
    ^g--limit=<number>^:       Limit messages\n\n`);
};