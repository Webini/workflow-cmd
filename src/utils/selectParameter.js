const term = require('../term.js');

module.exports = async ({ parameters = {}, choices, name, label, forceInput = false, required = true }) => {
  const output = Object.assign({}, parameters);
  let value = null;

  if ((!output || !output[name] || !choices.includes(output[name]) || forceInput) &&
        !parameters.nonInteractive) {
    term.white(`\n${label} : `);

    const newChoices = choices.slice(0).concat([ 'Cancel' ]);
    const result = await term.singleColumnMenuAsync(newChoices);
    term('\n');

    if (result.selectedIndex === choices.length) {
      throw new Error('Cancelled');
    }
    
    value = choices[result.selectedIndex];
  } else {
    value = output[name] || '';
  }

  if (value) {
    value.trim();
  }

  if (value.length <= 0 && required) {
    throw new Error(`Empty ${name}`);
  }

  return value;
};