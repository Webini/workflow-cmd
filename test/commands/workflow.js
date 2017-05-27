const assert = require('assert');
const package = require('../../package.json');
const listWorkflow = require('../../src/commands/list-workflows.js');
const createWorkflow = require('../../src/commands/create-workflow.js');
const deleteWorkflow = require('../../src/commands/delete-workflow.js');
const createProject = require('../../src/commands/create-project.js');
const deleteProject = require('../../src/commands/delete-project.js');
const workflowInit = require('../../src/commands/workflow-init.js');
const workflowAddstep = require('../../src/commands/workflow-addstep.js');
const createApi = require('../../src/commands/create-api.js');
const deleteApi = require('../../src/commands/delete-api.js');
const fs = require('fs');
const path = require('path');

describe('Workflow', () => {
  const filename = `${package.name}.json`;
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

  it('should init workflow', async () => {
    await workflowInit({ workflowName: 'test', output: __dirname });

    const file = path.join(__dirname, filename);
    const fileData = JSON.parse(fs.readFileSync(file, 'UTF-8'));
    fs.unlinkSync(file);
    assert.deepStrictEqual(fileData, { name: 'test', steps: [] });
  });

  it('should add lambda step to workflow', async () => {
    await workflowInit({ workflowName: 'test', output: __dirname });
    await workflowAddstep({ 
      workflowFile: path.resolve(__dirname, filename), 
      stepLabel: 'test-label',
      type: 'lambda',
      lambdaFile: './run.js',
      output: path.join(__dirname, filename),
    });


    const file = path.join(__dirname, filename);
    const fileData = JSON.parse(fs.readFileSync(file, 'UTF-8'));
    fs.unlinkSync(file);
    
    assert.deepStrictEqual(fileData, {
      name: 'test',
      steps: [
        {
          label: 'test-label',
          type: 'lambda',
          configuration: {
            file: '../../run.js'
          }
        }
      ]
    });
  });

  it.only('should add api step to workflow', async () => {
    const api = await createApi({
      projectId,
      apiName: 'test api item',
      apiHost: 'test host', 
      nonInteractive: true
    });

    await workflowInit({ workflowName: 'test', output: __dirname });
    await workflowAddstep({ 
      workflowFile: path.resolve(__dirname, filename), 
      stepLabel: 'test-label',
      type: 'api',
      projectId,
      apiId: api.id,
      apiEndpoint: '/test/yolo',
      apiMethod: 'GET',
      output: path.join(__dirname, filename),
    });


    const file = path.join(__dirname, filename);
    const fileData = JSON.parse(fs.readFileSync(file, 'UTF-8'));
    fs.unlinkSync(file);
    
    assert.deepStrictEqual(fileData, {
      name: 'test',
      steps: [
        {
          label: 'test-label',
          type: 'api',
          name: 'test api item',
          configuration: {
            endpoint: '/test/yolo',
            method: 'GET'
          }
        }
      ]
    });
  });
});