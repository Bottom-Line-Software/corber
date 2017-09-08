'use strict';

var td              = require('testdouble');
var PromiseExt      = require('rsvp');

var OpenCmd         = require('../../../lib/commands/open');
var OpenTask        = require('../../../lib/targets/cordova/tasks/open-app');

var mockProject     = require('../../fixtures/corber-mock/project');
var mockAnalytics   = require('../../fixtures/corber-mock/analytics');

describe('Open Command', function() {
  var open;

  beforeEach(function() {
    open = new OpenCmd({
      project: mockProject.project
    });
    open.analytics = mockAnalytics;

    td.replace(
      OpenTask.prototype,
      'run',
      function() { return PromiseExt.resolve(); }
    );
  });

  afterEach(function() {
    td.reset();
  });

  it('runs Open App Task', function() {
    var options =  { application: 'dummy', platform: 'ios' };

    return open.run(options)
      .then(function() {
        return true;
      });
  });
});
