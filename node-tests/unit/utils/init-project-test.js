'use strict';

var td              = require('testdouble');
var expect          = require('../../helpers/expect');
var mockProject     = require('../../fixtures/ember-cordova-mock/project');
var Promise         = require('rsvp');
var CreateCordova   = require('../../../lib/tasks/create-cordova-project');
var GitIgnore       = require('../../../lib/tasks/update-gitignore');
var WatchmanCfg     = require('../../../lib/tasks/update-watchman-config');

describe('Blueprint initProject', function() {
  var initProject;
  var project = mockProject.project;
  var ui = mockProject.ui;

  beforeEach(function() {
    initProject = require('../../../lib/utils/init-project');
  });

  afterEach(function() {
    td.reset();
  });


  it('runs tasks in the correct order', function() {
    var tasks = [];

    td.replace(CreateCordova.prototype, 'run', function() {
      tasks.push('create-cordova-project');
      return Promise.resolve();
    });

    td.replace(GitIgnore.prototype, 'run', function() {
      tasks.push('update-gitignore');
      return Promise.resolve();
    });

    td.replace(WatchmanCfg.prototype, 'run', function() {
      tasks.push('update-watchman-config');
      return Promise.resolve();
    });

    return initProject({}, project, ui).then(function() {
      expect(tasks).to.deep.equal([
        'create-cordova-project',
        'update-gitignore',
        'update-watchman-config'
      ]);
    });
  });

  it('passes template path', function() {
    td.replace(CreateCordova.prototype, 'run', function(path) {
      expect(path).to.equal('templatePath');
      return Promise.resolve();
    });
    initProject({templatePath: 'templatePath'}, project, ui);
  });
});
