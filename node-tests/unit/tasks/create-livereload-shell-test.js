'use strict';

var td              = require('testdouble');
var Promise         = require('rsvp');
var mockProject     = require('../../fixtures/ember-cordova-mock/project');
var fsUtils         = require('../../../lib/utils/fs-utils');

var expect          = require('../../helpers/expect');
var contains        = td.matchers.contains;
var isObject        = td.matchers.isA(Object);

var setupTask = function(shouldMockTemplate) {
  var CreateShell = require('../../../lib/tasks/create-livereload-shell');

  var shellTask = new CreateShell({
    project: mockProject.project
  });

  if (shouldMockTemplate) {
    td.replace(CreateShell.prototype, 'getShellTemplate', function() {
      return Promise.resolve('{{liveReloadUrl}}');
    });
  }

  return shellTask;
};

describe('Create Cordova Shell Task', function() {
  beforeEach(function() {
    td.replace(fsUtils, 'write', function() {
      return Promise.resolve();
    });
  });

  afterEach(function() {
    td.reset();
  });

  describe('getShellTemplate', function() {
    it('reads the right path', function() {
      var shellTask = setupTask();
      var readDouble = td.replace(fsUtils, 'read');

      shellTask.getShellTemplate();
      td.verify(readDouble(
        contains('templates/livereload-shell/index.html'),
        isObject
      ));
    });
  });

  it('attempts to get shell template', function() {
    var shellTask = setupTask();
    var called = false;

    td.replace(shellTask, 'getShellTemplate', function() {
      called = true;
      return Promise.resolve();
    });

    shellTask.run();
    expect(called).to.equal(true);
  });

  it('createShell replaces {{liveReloadUrl}} and saves', function() {
    var shellTask = setupTask(true);
    var writeContent;

    td.replace(fsUtils, 'write', function(path, content) {
      writeContent = content;
      return Promise.resolve();
    });

    return shellTask.createShell('path', '{{liveReloadUrl}}', 'fakeUrl')
      .then(function() {
        expect(writeContent).to.equal('fakeUrl');
      });
  });

  it('catches errors', function() {
    td.replace(fsUtils, 'write', function() {
      throw new Error();
    });

    var shellTask = setupTask(true);
    return expect(shellTask.run()).to.be.rejectedWith(
      /Error moving index\.html/
    );
  });
});
