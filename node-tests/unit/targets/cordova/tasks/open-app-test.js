var td              = require('testdouble');
var path            = require('path');
var BashTask        = require('../../../../../lib/tasks/bash');
var OpenAppTask     = require('../../../../../lib/targets/cordova/tasks/open-app');
var expect          = require('../../../../helpers/expect');
var openCommand     = require('../../../../../lib/utils/open-app-command');
var mockProject     = require('../../../../fixtures/corber-mock/project');
var _merge          = require('lodash').merge;
var isObject        = td.matchers.isA(Object);

describe('Cordova Open App Task', function() {
  var bashDouble, openApp, cdvPath;

  beforeEach(function() {
    bashDouble = td.replace(BashTask.prototype, 'runCommand');
    cdvPath = path.resolve(
      __dirname, '../../../../',
      'fixtures',
      'corber-mock/corber/cordova'
    );

    openApp = new OpenAppTask(_merge(mockProject, { platform: 'ios' }));
  });

  afterEach(function() {
    td.reset();
  });

  it('runs open command for ios', function() {
    openApp.run();
    var expectedPath = cdvPath + '/platforms/ios/*.xcodeproj';
    var expectedCmd  = openCommand(expectedPath);
    td.verify(bashDouble(expectedCmd, isObject));
  });

  it('runs open command for Android', function() {
    openApp.platform = 'android';
    openApp.run();

    var expectedPath = cdvPath + '/platforms/android/';
    var expectedCmd  = openCommand(expectedPath);
    td.verify(bashDouble(expectedCmd, isObject));
  }),

  it('outputs an error if no platform is specified', function() {
    openApp.platform = 'invalidPlatform';

    return expect(openApp.run()).to.eventually.be.rejectedWith(
      /platform is not supported/
    );
  });
});
