const request = require('request-promise-native');
const debug   = require('./debug.js');

const WORKFLOW_API_URL = process.env.WORKFLOW_API_URL || 'http://127.0.0.1:8080';

const API_ENDPOINTS = {
  getProjects: {
    method: 'GET',
    path: '/projects',
  },
  searchProjects: {
    method: 'POST',
    path: '/projects',
  },
  createProject: {
    method: 'PUT',
    path: '/projects'
  },
  getProject: {
    method: 'GET',
    path: '/projects/:project_id'
  },
  deleteProject: {
    method: 'DELETE',
    path: '/projects/:project_id'
  },
  updateProject: {
    method: 'PUT',
    path: '/projects/:project_id'
  },

  getApis: {
    method: 'GET',
    path: '/projects/:project_id/api',
  },
  searchApi: {
    method: 'POST',
    path: '/projects/:project_id/api',
  },
  createApi: {
    method: 'PUT',
    path: '/projects/:project_id/api'
  },
  getApi: {
    method: 'GET',
    path: '/projects/:project_id/api/:api_id'
  },
  deleteApi: {
    method: 'DELETE',
    path: '/projects/:project_id/api/:api_id'
  },
  updateApi: {
    method: 'PUT',
    path: '/projects/:project_id/api/:api_id'
  },

  getWorkflows: {
    method: 'GET',
    path: '/projects/:project_id/workflows',
  },
  searchWorkflows: {
    method: 'POST',
    path: '/projects/:project_id/workflows',
  },
  createWorkflow: {
    method: 'PUT',
    path: '/projects/:project_id/workflows'
  },
  getWorkflow: {
    method: 'GET',
    path: '/projects/:project_id/workflows/:workflow_id'
  },
  deleteWorkflow: {
    method: 'DELETE',
    path: '/projects/:project_id/workflows/:workflow_id'
  },
  updateWorkflow: {
    method: 'PUT',
    path: '/projects/:project_id/workflows/:workflow_id'
  },

  getMessages: {
    method: 'GET',
    path: '/projects/:project_id/workflows/:workflow_id/messages',
  },
  searchMessages: {
    method: 'POST',
    path: '/projects/:project_id/workflows/:workflow_id/messages',
  },
  createMessages: {
    method: 'PUT',
    path: '/projects/:project_id/workflows/:workflow_id/messages'
  },
  getMessage: {
    method: 'GET',
    path: '/projects/:project_id/workflows/:workflow_id/messages/:message_id'
  },
  deleteMessage: {
    method: 'DELETE',
    path: '/projects/:project_id/workflows/:workflow_id/messages/:message_id'
  },
  updateMessage: {
    method: 'PUT',
    path: '/projects/:project_id/workflows/:workflow_id/messages/:message_id'
  }


};

function callServer(apiKey, params, endpoint) {
  const uri = `${WORKFLOW_API_URL}/api${endpoint.path}`
    .replace(':message_id', params.message_id)
    .replace(':workflow_id', params.workflow_id)
    .replace(':project_id', params.project_id)
    .replace(':api_id', params.api_id)
  ;

  debug('%s %s with %o', endpoint.method, uri, params);

  return request({
    headers: {
      'x-api-key': apiKey
    },
    uri: uri,
    json: true,
    method: endpoint.method,
    body: params.body,
  });
}

function Api(apiKey) {
  this.apiKey = apiKey;
  this.URL = WORKFLOW_API_URL;
}

Object.keys(API_ENDPOINTS).forEach((value) => {
  Api.prototype[value] = function(params) {
    return callServer(this.apiKey, params, API_ENDPOINTS[value]);
  };
});

module.exports = Api;