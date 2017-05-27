const term = require('../term.js');
const package = require('../../package.json');
const getParameter = require('../utils/getParameter.js');
const path = require('path');
const fs   = require('fs');
const Workflow = require('../utils/workflow.js');

module.exports = async function(parameters = {}) {
  parameters.canCreate = true;

  const name = await getParameter({
    parameters, 
    name: 'workflowName', 
    label: 'Please enter your worlkflow name'
  });
  
  const basepath = parameters.output || process.cwd();
  const output = path.join(basepath, `${package.name}.json`);
  if (fs.existsSync(output)) {
    throw new Error(`${output} already exists`);
  }

  const workflow = Workflow.create(name, basepath);
  workflow.write(output);

  term(`Workflow ^b${workflow.getName()}^ created in ^y#${basepath}\n\n`);
  return workflow;
};

module.exports.help = function() {
  term.brightWhite('init')(`
  Create a new workflow
  parameters :   
    ^g--workflow-name=<name>^: Your new workflow name 
    ^g--output=<directory>^:   Workflow output directory\n\n`);
};