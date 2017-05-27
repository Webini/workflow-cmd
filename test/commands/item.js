const path = require('path');
const listItems = require('../../src/commands/list-items.js');
const createItem = require('../../src/commands/create-item.js');
const deleteItem = require('../../src/commands/delete-item.js');

const createWorkflow = require('../../src/commands/create-workflow.js');
const deleteWorkflow = require('../../src/commands/delete-workflow.js');
const createApi = require('../../src/commands/create-api.js');
const deleteApi = require('../../src/commands/delete-api.js');
const createProject = require('../../src/commands/create-project.js');
const deleteProject = require('../../src/commands/delete-project.js');

describe('Item', () => {
  let projectId = null;
  let workflowId = null;

  before(async () => {
    projectId = (await createProject({ projectName: 'test workflow' })).id;
    workflowId = (await createWorkflow({ projectId, workflowName: 'test workflow' })).id;
  });

  after(async () => {
    await deleteWorkflow({ projectId, workflowId, nonInteractive: true });
    await deleteProject({ projectId, nonInteractive: true });
  });

  it('should list items', () => {
    return listItems({ projectId, workflowId });
  });

  it('should create api item', async () => {
    const api = await createApi({
      projectId,
      apiName: 'test api item',
      apiHost: 'test host', 
      nonInteractive: true
    });

    const apiItem = await createItem({ 
      apiId: api.id,
      projectId, 
      workflowId,
      itemLabel: 'api test',
      type: 'api',
      apiMethod: 'POST',
      apiEndpoint: '/yolo'
    });

    await deleteApi({
      workflowId, projectId, apiId: api.id, nonInteractive: true
    });
    await deleteItem({
      workflowId, projectId, itemId: apiItem.id, nonInteractive: true
    });
  });

  it('should create lambda item', async () => {
    const lambda = await createItem({ 
      projectId, 
      workflowId,
      itemLabel: 'lambda test',
      type: 'lambda',
      lambdaFile: path.join(__dirname, './api.js')
    });
    await deleteItem({
      workflowId, projectId, itemId: lambda.id, nonInteractive: true
    });
  });
});