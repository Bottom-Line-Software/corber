'use strict';

var Task            = require('../../../tasks/-task');
var CordovaRawTask  = require('./raw');
var logger          = require('../../../utils/logger');

module.exports = Task.extend({
  project: undefined,
  verbose: false,

  run: function() {
    logger.info('Running cordova prepare');
    var prepare = new CordovaRawTask({
      project: this.project,
      rawApi: 'prepare',
    });

    return prepare.run({ verbose: this.verbose });
  }
});
