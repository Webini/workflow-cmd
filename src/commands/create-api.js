const term = require('../term.js');
const getParameter = require('../utils/getParameter.js');
const selectProject = require('./select-project.js');

async function addHeaders(headers = {}) {
  const headersName = Object.keys(headers);
  if (headersName.length > 0) {
    term('\nHeaders defined : \n');
    Object
      .keys(headers)
      .forEach((name) => {
        term(`^w${name}^: : ${headers[name]}\n`);
      })
    ;
  }

  term('\nAdd new header ? [Y|n]\n' ) ;
  const result = await term.yesOrNoAsync({ yes: [ 'y', 'Y', 'ENTER' ], no: [ 'n' ] });
  if (!result) {
    return headers;
  }

  const name = await getParameter({ 
    forceInput: true,
    required: false,
    name: 'header name', 
    label: 'Please enter header\'s name'
  });
  const value = await getParameter({ 
    parameters: headers,
    forceInput: true,
    required: false,
    name, 
    label: 'Please enter header\'s value'
  });

  if (!value.length || !name.length) {
    term.error('Empty name or value, this header is ignored');
  } else {
    headers[name] = value;
  }

  return await addHeaders(headers);
}

function extractDefinedHeaders(parameters) {
  return Object
    .keys(parameters)
    .reduce((headers, paramName) => {
      const matches = paramName.match(/^header([A-Z][a-zA-Z]*)$/);
      if (matches) {
        let name = matches[1].charAt(0).toLowerCase() + matches[1].substr(1);
        name = name.replace(/([A-Z])/g, (original, match) => `-${match.toLowerCase()}`);
        headers[name] = parameters[paramName];
      }
      return headers;
    }, {})
  ;
}

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  parameters.canCreate = true;
  await selectProject(parameters);

  const name = await getParameter({ 
    parameters, 
    name: 'apiName', 
    label: 'Please enter your api name' 
  });
  const host = await getParameter({ 
    parameters, 
    name: 'apiHost', 
    label: 'Please enter your api hostname' 
  });
  
  const headers = extractDefinedHeaders(parameters);
  if (!parameters.nonInteractive) {
    await addHeaders(headers);
  }
  
  const result = await api.createApi({ 
    project_id: parameters.projectId, 
    body: { name, host, headers } 
  });

  term(`Api ^b${result.name}^: created with id ^y#${result.id}\n\n`);
  return result;
};

module.exports.help = function() {
  term.brightWhite('create-api')(`
  Create a new api for the project
  parameters :   
    ^g--api-name=<name>^: Your new api name
    ^g--host=<host>^:     Api host
    ^g--project-id=<id>^: Project id
    ^g--header-name=<headerValue>^: define headers\n\n`);
};