const should = require('should');
const package = require('../package.json');
const path = require('path');
const fs = require('fs');

describe('apikey', () => {
  const originalApiKey = process.env.API_KEY;
  process.env.HOME = __dirname;
  process.env.API_KEY = 'test env apikey';
  const filename = `.${package.name}`;
  const filepath = path.join(process.env.HOME, filename);
  const apikey = require('../src/apikey.js');

  after(() => {
    apikey.set(originalApiKey);
    try {
      fs.unlinkSync(filepath);
    } catch(e) {}
  });

  it('should return env apikey', () => {
    const key = apikey.get();
    should(key).equal('test env apikey');
    delete process.env.API_KEY;
  });

  it('should set key to file', () => {
    apikey.set('testcreate');
    const key = fs.readFileSync(filepath, 'UTF-8');
    should(key).equal('testcreate');
  });
});