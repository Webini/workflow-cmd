const fs = require('fs');
const path = require('path');
const package = require('../package.json');
const keyfile = `.${package.name}`;
const homepath = process.env.HOMEPATH || process.env.HOME;
const filepath = path.join(homepath, keyfile);
const debug = require('./debug.js');

let key = null;

module.exports = {
  get: function(assert = true) {
    if (key === null) {
      try {
        key = fs.readFileSync(filepath, 'UTF-8');
      } catch(e) { 
        debug('cannot read key %o', e.message);
      }
    }
    if (key === null && assert) {
      throw new Error('Missing apikey, please use command configure to set it up.');
    }
    return key;
  },
  set: function(apikey) {
    key = apikey;
    fs.writeFileSync(filepath, key, 'UTF-8');
  }
};
