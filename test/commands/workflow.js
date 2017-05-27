const listWorkflow = require('../../src/commands/list-workflows.js');
const createWorkflow = require('../../src/commands/create-workflow.js');
const deleteWorkflow = require('../../src/commands/delete-workflow.js');
const createProject = require('../../src/commands/create-project.js');
const deleteProject = require('../../src/commands/delete-project.js');

describe('Workflow', () => {
  let projectId = null;

  before(async () => {
    projectId = (await createProject({ projectName: 'test workflow' })).id;
  });

  after(() => {
    return deleteProject({ projectId, nonInteractive: true });
  });

  it('should list workflows', () => {
    return listWorkflow({ projectId });
  });

  it('should create & delete workflow', async () => {
    return await deleteWorkflow({
      projectId,
      workflowId: (await createWorkflow({ 
        projectId, 
        workflowName: 'test workflwo'
      })).id,
      nonInteractive: true
    });
  });
});