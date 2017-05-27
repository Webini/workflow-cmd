const term = require('../../term.js');
const fs = require('fs');
const path = require('path');

module.exports = async function(parameters = {}) {
  parameters.canCreate = true;
  
  let filepath = (parameters.lambdaFile && path.resolve(process.cwd(), parameters.lambdaFile));
  if (!filepath) {
    term('\nEnter lambda path : ');
    filepath = await term.fileInputAsync({ cancelable: true });
  }
  
  let code = null;
  try {
    code = fs.readFileSync(filepath, 'UTF-8');
  } catch(e) {
    throw new Error('File not found');
  }

  return { 
    configuration: {
      code: code
    }
  };
};

module.exports.help = function() {
  term(
'      ^g --lambda-file=</path/to/lambda>^: lambda filepath\n');
};