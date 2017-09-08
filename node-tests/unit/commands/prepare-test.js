'use strict';

var td              = require('testdouble');
var expect          = require('../../helpers/expect');
var Promise         = require('rsvp');

var PrepareCmd      = require('../../../lib/commands/prepare');
var PrepareTask     = require('../../../lib/targets/cordova/tasks/prepare');
var HookTask        = require('../../../lib/tasks/run-hook');

var mockProject     = require('../../fixtures/corber-mock/project');
var mockAnalytics   = require('../../fixtures/corber-mock/analytics');

describe('Prepare Command', function() {
  var tasks, prepare;

  beforeEach(function() {
    tasks = [];

    prepare = new PrepareCmd({
      project: mockProject.project
    });
    prepare.analytics = mockAnalytics;

    td.replace(PrepareTask.prototype, 'run', function(hookName) {
      tasks.push('prepare');
    });

    td.replace(HookTask.prototype, 'run', function(hookName, options) {
      expect(options, `${hookName} options`).to.be.an('object');
      tasks.push('hook ' + hookName);
      return Promise.resolve();
    });
  });

  afterEach(function() {
    PrepareTask.prototype.project = undefined;

    td.reset();
  });

  it('runs tasks in the correct order', function() {
    return prepare.run({}).then(function() {
      ////h-t ember-electron for the pattern
      expect(tasks).to.deep.equal([
        'hook beforePrepare',
        'prepare',
        'hook afterPrepare'
      ]);
    });
  });
});
