const should = require('should');
const package = require('../package.json');
const path = require('path');
const fs = require('fs');

describe('apikey', () => {
  process.env.HOME = __dirname;
  const filename = `.${package.name}`;
  const filepath = path.join(process.env.HOME, filename);
  const apikey = require('../src/apikey.js');

  after(() => {
    fs.unlink(filepath);
  });

  it('should throw', () => {
    should.throws(() => {
      apikey.get();
    });
  });

  it('should return null', () => {
    should(apikey.get(false)).be.null();
  });

  it('should set key to file', () => {
    apikey.set('testcreate');
    const key = fs.readFileSync(filepath, 'UTF-8');
    key.should.be.equal('testcreate');
  });
});