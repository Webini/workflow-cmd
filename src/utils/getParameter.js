const term = require('../term.js');

module.exports = async ({ parameters = {}, name, label, forceInput = false, required = true }) => {
  const output = Object.assign({}, parameters);
  let value = null;

  if (!output || !output[name] || forceInput) {
    term.white(`\n${label} : `);
    value = await term.inputFieldAsync({ default: output[name] || '', cancelable: true });
    term('\n');
  } else {
    value = output[name];
  }

  if (value) {
    value.trim();
  }

  if (value.length <= 0 && required) {
    throw new Error(`Empty ${name}`);
  }

  return value;
};