const package = require('../../package.json');
const term = require('../term.js');
const getParameter = require('../utils/getParameter.js');
const path = require('path');
const Workflow = require('../utils/workflow.js');
const selectParameter = require('../utils/selectParameter.js');
const stepTypes = require('./types/index.js');

module.exports = async function(parameters = {}) {
  parameters.canCreate = true;

  const file = parameters.workflowFile || path.join(process.cwd(), `${package.name}.json`);
  const workflow = Workflow.open(file);
  
  const label = await getParameter({
    parameters, 
    name: 'stepLabel', 
    label: 'Please enter the step label'
  });

  const type = await selectParameter({ 
    parameters,
    name: 'type',
    label: 'Select type',
    choices: Object.keys(stepTypes)
  });
  
  const step = await stepTypes[type](parameters);
  workflow.addStep(Object.assign({ label, type }, step));
  workflow.write(file);

  term(`Workflow ^b${workflow.getName()}^ saved in ^y#${file}\n\n`);
  return workflow;
};

module.exports.help = function() {
  term.brightWhite('addstep')(`
  Add step to the workflow
  parameters :   
    ^g--workflow-file=<file>^:              Your workflow.json file
    ^g--step-label=<label>^:                The step label 
    ^g--type=<${Object.keys(stepTypes)}>^:  Step type \n`);

  Object.keys(stepTypes).map((key) => {
    term(`
    type ${key} \n`);

    stepTypes[key].help();
  });
  term('\n');
};