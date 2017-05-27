const term = require('../term.js');
const getParameter = require('../utils/getParameter.js');

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
  const result = await term.yesOrNoAsync({ yes: [ 'y' , 'ENTER' ], no: [ 'n' ] });
  if (!result) {
    return headers;
  }

  const name = await getParameter({ 
    forceInput: true,
    required: false,
    name: 'header name', 
    label:'Please enter header\'s name'
  });
  const value = await getParameter({ 
    parameters: headers,
    forceInput: true,
    required: false,
    name, 
    label:'Please enter header\'s value'
  });

  if (!value.length || !name.length) {
    term.error('Empty name or value, this header is ignored');
  } else {
    headers[name] = value;
  }

  return await addHeaders(headers);
}

module.exports = async function(parameters = {}) {
  const api = require('../api.js');
  const selectProject = require('./select-project.js');

  const projectId = await selectProject(parameters);

  const name = await getParameter({ 
    parameters, 
    name: 'api-name', 
    label: 'Please enter your api name' 
  });
  const host = await getParameter({ 
    parameters, 
    name: 'api-name', 
    label: 'Please enter your api hostname' 
  });
  
  const headers = await addHeaders();
  
  const result = await api.createApi({ 
    project_id: projectId, 
    body: { name, host, headers } 
  });

  term(`Api ^b${result.name}^: created with id ^y#${result.id}\n\n`);
  return result;
};

module.exports.help = function() {
  term.brightWhite('create-api')(`
  Create a new api for the project
  parameters :   
    ^g[optional] --api-name=<name>^: Your new api name
    ^g[optional] --host=<host>^:     Api host
    ^g[optional] --project-id=<id>^: Project id \n\n`);
};