const listProjects = require('../../src/commands/list-projects.js');
const createProject = require('../../src/commands/create-project.js');
const deleteProject = require('../../src/commands/delete-project.js');

describe('Project', () => {
  it('should list projects', () => {
    return listProjects();
  });

  it('should create & delete project', async () => {
    return deleteProject({
      projectId: (await createProject({ projectName: 'test delete' })).id,
      nonInteractive: true
    });
  });
});