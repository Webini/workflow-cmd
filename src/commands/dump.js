const term = require('../term.js');
const selectMessage = require('./select-message.js');
const path = require('path');
const fs = require('fs');

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = false;

  await selectMessage(parameters);

  const message = await api.getMessage({ 
    project_id: parameters.projectId,
    workflow_id: parameters.workflowId,
    message_id: parameters.messageId
  });

  const dumpResult = !!parameters.result; 
  const file = parameters.outputFile || path.join(process.cwd(), `${message.id}.${dumpResult ? 'result.' : ''}json`);
  
  if (fs.existsSync(file)) {
    let replace = parameters.forceReplace;
    if (!replace && !parameters.nonInteractive) {
      term('\File already exists, replace it ? [y|N]\n');
      replace = await term.yesOrNoAsync({ yes: [ 'y' ], no: [ 'n', 'N', 'ENTER' ] });
    }
    if(!replace) {
      throw new Error(`File ${file} already exists`);
    }
  }

  fs.writeFileSync(file, JSON.stringify((dumpResult ? message.result : message.content), null, 4));

  term(`\nmessage ${message.id} dumped in ${file}\n\n`);
};

module.exports.help = function() {
  term.brightWhite('dump')(`
  Dump original request message
  parameters :   
    ^g--project-id=<id>^:        Project id 
    ^g--workflow-id=<id>^:       Workflow id
    ^g--output-file=<filepath>^: Output file
    ^g--message-id=<id>^:        Message id
    ^g--result^:                 Dump workflow result
    ^g--force-replace            Replace file if already preset\n\n`);
};