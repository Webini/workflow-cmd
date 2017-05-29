const term = require('../term.js');
const getParameter = require('../utils/getParameter.js');
const selectProject = require('./select-project.js');

async function addElements(elements = {}, name) {
  const headersName = Object.keys(elements);
  if (headersName.length > 0) {
    term(`\n${name} defined : \n`);
    Object
      .keys(elements)
      .forEach((name) => {
        term(`^w${name}^: : ${elements[name]}\n`);
      })
    ;
  }

  term(`\nAdd new ${name} ? [Y|n]\n`) ;
  const result = await term.yesOrNoAsync({ yes: [ 'y', 'Y', 'ENTER' ], no: [ 'n' ] });
  if (!result) {
    return elements;
  }

  const elName = await getParameter({ 
    forceInput: true,
    required: false,
    name: `${name} name`, 
    label: `Please enter ${name}\'s name`
  });
  const elValue = await getParameter({ 
    parameters: elements,
    forceInput: true,
    required: false,
    name, 
    label: `Please enter ${name}\'s value`
  });

  if (!elValue.length || !elName.length) {
    term.error(`Empty name or value, this ${name} is ignored`);
  } else {
    elements[elName] = elValue;
  }

  return await addElements(elements, name);
}

function extractDefinedElements(parameters, name) {
  return Object
    .keys(parameters)
    .reduce((output, paramName) => {
      const matches = paramName.match(new RegExp(`^${name}([A-Z][a-zA-Z]*)$`));
      if (matches) {
        let name = matches[1].charAt(0).toLowerCase() + matches[1].substr(1);
        name = name.replace(/([A-Z])/g, (original, match) => `-${match.toLowerCase()}`);
        output[name] = parameters[paramName];
      }
      return output;
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
  
  const headers = extractDefinedElements(parameters, 'header');
  if (!parameters.nonInteractive) {
    await addElements(headers, 'headers');
  }

  const qs = extractDefinedElements(parameters, 'qs');
  if (!parameters.nonInteractive) {
    await addElements(qs, 'query string');
  }
  
  const result = await api.createApi({ 
    project_id: parameters.projectId, 
    body: { name, host, headers, qs } 
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
    ^g--header-{{name}}=<headerValue>^: define headers
    ^g--qs-{{name}}=<query string value>^: query string value\n\n`);
};