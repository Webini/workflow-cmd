const should = require('should');
const listApi = require('../../src/commands/list-apis.js');
const createApi = require('../../src/commands/create-api.js');
const deleteApi = require('../../src/commands/delete-api.js');
const createProject = require('../../src/commands/create-project.js');
const deleteProject = require('../../src/commands/delete-project.js');

describe('Api', () => {
  let projectId = null;

  before(async () => {
    projectId = (await createProject({ projectName: 'test api' })).id;
  });

  after(() => {
    return deleteProject({ projectId, nonInteractive: true });
  });

  it('should list apis', () => {
    return listApi({ projectId });
  });

  it('should create & delete api', async () => {
    const result = await createApi({ 
      projectId, 
      apiName: 'test api',
      apiHost: 'test host',
      headerXApiKey: 'test header',
      nonInteractive: true
    });
    
    should(result.headers['x-api-key']).equal('test header', 'invalid header');

    return await deleteApi({
      projectId,
      apiId: result.id,
      nonInteractive: true
    });
  });
});