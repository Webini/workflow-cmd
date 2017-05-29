const term = require('../term.js');
const selectWorkflow = require('./select-workflow.js');
const status = require('../utils/status.js');

module.exports = async function(parameters = { canCreate: true }) {
  const api = require('../api.js');

  await selectWorkflow(parameters);

  if (parameters.messageId) {
    return parameters.messageId;
  } 

  const { count, data: messages }  = await api.searchMessages({ 
    project_id: parameters.projectId,
    workflow_id: parameters.workflowId,
    body: {
      limit: 50,
      order_field: 'updated_at',
      order_dir: 'DESC'
    }
  });
  
  term('\nSelect message\n');
  term(`${count} message(s) found\n`);

  const options = messages.map((message) => `# ${message.id} : ${status.vk[message.status]} (${new Date(message.updated_at)})`);
  options.push('Cancel');

  const result = await term.singleColumnMenuAsync(options);
  
  term('\n');
  
  if(result.selectedIndex === messages.length) {
    throw new Error('Cancelled');
  } else {
    parameters.messageId = messages[result.selectedIndex].id;
  }

  return parameters.messageId;
};

module.exports.private = true;