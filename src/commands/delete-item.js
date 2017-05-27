const term = require('../term.js');
const selectItem = require('./select-item.js');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = false;

  await selectItem(parameters);

  term('\nAre you sure ? [Y|n] \n');
  if (parameters.nonInteractive || await term.yesOrNoAsync({ yes: [ 'y', 'Y', 'ENTER' ], no: [ 'n' ] })) {
    await api.deleteItem({ 
      project_id: parameters.projectId,
      workflow_id: parameters.workflowId,
      item_id: parameters.itemId,
    });

    term('Item ').yellow(`#${parameters.itemId}`)(' deleted \n\n');
  } else {
    throw new Error('Cancelled');
  }
};

module.exports.help = function() {
  term.brightWhite('delete-item')(`
  Delete an item
  parameters :
    ^g--item-id=<id>^:     Item id   
    ^g--workflow-id=<id>^: Workflow id
    ^g--project-id=<id>^:  Project id \n\n`);
};