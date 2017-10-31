var td              = require('testdouble');
var expect          = require('../../../../helpers/expect');
var mockProject     = require('../../../../fixtures/corber-mock/project');
var ValidateLocType = require('../../../../../lib/frameworks/ember/validators/location-type');
var logger          = require('../../../../../lib/utils/logger');
var contains        = td.matchers.contains;

describe('Validate Location Type', function() {
  var validateLoc;

  beforeEach(function() {
    validateLoc = new ValidateLocType({
      project: mockProject.project
    });
  });

  afterEach(function() {
    td.reset();
  });

  it('rejects when config.locationType is auto', function() {
    validateLoc.config = { locationType: 'auto' };
    return expect(validateLoc.run()).to.eventually.be.rejected;
  });

  it('throws an error with config.locationType is blank', function() {
    validateLoc.config = {};
    return expect(validateLoc.run()).to.eventually.be.rejected;
  });

  it('resolves if config.locationType is hash', function() {
    validateLoc.config = { locationType: 'hash' };
    return expect(validateLoc.run()).to.eventually.be.fulfilled;
  });

  it('resolves if config.locationType is none', function() {
    validateLoc.config = { locationType: 'none' };
    return expect(validateLoc.run()).to.eventually.be.fulfilled;
  });

  it('when force is true, it warns vs rejects', function() {
    validateLoc.config = { locationType: 'auto' };
    validateLoc.force = true;

    var warnDouble = td.replace(logger, 'warn');

    return validateLoc.run().then(function() {
      td.verify(warnDouble(contains('You have passed the --force flag')));
    });
  });
});
