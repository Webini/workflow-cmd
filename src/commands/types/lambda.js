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
  console.log(filepath);
  if (!fs.existsSync(filepath)) {
    throw new Error('Lambda file not found');
  }

  return { 
    configuration: {
      file: filepath
    }
  };
};

module.exports.help = function() {
  term(
'      ^g --lambda-file=</path/to/lambda>^: lambda filepath\n');
};