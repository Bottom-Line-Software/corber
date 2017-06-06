'use strict';

var LiveReloadServer = require('ember-cli/lib/tasks/server/livereload-server');
var ExpressServer    = require('ember-cli/lib/tasks/server/express-server');
var RSVP             = require('rsvp');
var Task             = require('ember-cli/lib/models/task');
var Watcher          = require('ember-cli/lib/models/watcher');
var Builder          = require('ember-cli/lib/models/builder');
var chalk            = require('chalk');
var logger           = require('../utils/logger');
var rimraf           = require('rimraf');
var editXml          = require('../utils/edit-xml');

/* eslint-disable max-len */
/*
 Largely taken from: https://github.com/ember-cli/ember-cli/blob/master/lib/tasks/serve.js
 We simply need the Serve task without the hang build into ember-clis Task*

 We pass a mock analytics object, because we are importing ember-cli models

 That conflicts with our analyics. #TODO - better solution
*/

var mockAnalytics = require('../../node-tests/fixtures/ember-cordova-mock/analytics');
/* eslint-enable max-len */

module.exports = Task.extend({
  project: undefined,
  ui: undefined,
  analytics: undefined,

  run: function(options) {
    this.cleanupOnExit();

    var watcher = new Watcher({
      ui: this.ui,
      builder: new Builder({
        ui: this.ui,
        outputPath: 'ember-cordova/tmp-livereload',
        project: this.project,
        environment: options.environment
      }),
      analytics: mockAnalytics,
      options: options
    });

    var expressServer = new ExpressServer({
      ui: this.ui,
      project: this.project,
      watcher: watcher,
      serverRoot: './server',
    });

    var liveReloadServer = new LiveReloadServer({
      ui: this.ui,
      analytics: mockAnalytics,
      project: this.project,
      watcher: watcher,
      expressServer: expressServer
    });

    // h/t ember-cli, hang until user exit
    this._runDeferred = RSVP.defer();
    return RSVP.Promise.all([
      liveReloadServer.start(options),
      expressServer.start(options),
      watcher.then()
    ]).then(function() {
      if (options.liveReload) {
        logger.success('ember-cordova: Device LiveReload is enabled');
      }

      return this._runDeferred.promise;
    }.bind(this));
  },

  cleanupOnExit: function() {
    process.on('SIGINT', function () {
      editXml.removeNavigation(this.project);

      logger.info(chalk.blue(
        'ember-cordova: Exiting, cleaning up tmp serve'
      ));

      try {
        rimraf.sync('ember-cordova/tmp-livereload');
      } catch (err) {
        logger.error(err);
      }

      return this._runDeferred.resolve()
    }.bind(this));
  }
});
