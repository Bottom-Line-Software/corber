'use strict';

var td              = require('testdouble');
var Promise         = require('rsvp');
var mockProject     = require('../../../../fixtures/ember-cordova-mock/project');

describe('Ember Build Task', function() {
  beforeEach(function() {
    td.reset();
  });

  xit('runs an ember builder', function() {
  });

  it('stubs .gitkeep after ember build', function() {
    var createKeepDouble = td.replace('../../../../../lib/utils/create-gitkeep');
    var EmberBuildTask  = require('../../../../../lib/frameworks/ember/tasks/build');

    td.replace(EmberBuildTask.prototype, 'initBuilder', function() {
      return {
        build: function() {
          return Promise.resolve();
        }
      }
    });

    var build  = new EmberBuildTask({
      project: mockProject.project
    });

    return build.run().then(function() {
      td.verify(createKeepDouble('ember-cordova/cordova/www/.gitkeep'));
    });
  });
});
