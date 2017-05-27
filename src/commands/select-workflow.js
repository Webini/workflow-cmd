const term = require('../term.js');

module.exports = async function(parameters = { 'can-create': true }) {
  const api = require('../api.js');
  const selectProject = require('./select-project.js');
  const createWorkflow = require('./create-workflow.js');
  const canCreate = !!parameters['can-create'];

  const projectId = await selectProject(parameters);

  if (parameters['workflow-id']) {
    return { projectId, workflowId: parameters['workflow-id'] };
  }

  const { count, data: workflows }  = await api.searchWorkflows({ 
    project_id: projectId,
    body: { limit: 50 } 
  });
  term('\nSelect workflow\n');
  term(`${count} workflow(s) found\n`);

  const options = workflows.map((workflow) => `#${workflow.id} : ${workflow.name||'No name'}\n`);
  if (canCreate) {
    options.push('New workflow ');
  }
  options.push('Cancel');

  const result = await term.singleColumnMenuAsync(options);
  
  term('\n');
  
  if (result.selectedIndex === workflows.length && canCreate) {
    return {
      projectId,
      workflow: (await createWorkflow(parameters)).id
    }; 
  } else if(result.selectedIndex === workflows.length + (canCreate ? 1 : 0)) {
    throw new Error('Cancelled');
  } else {
    return { 
      projectId, 
      workflowId: workflows[result.selectedIndex].id
    };
  }
};

//module.exports.private = true;