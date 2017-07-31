'use strict';

var Task            = require('./-task');
var Promise         = require('rsvp').Promise;

var cordovaPath     = require('../targets/cordova/utils/get-path');
var fsUtils         = require('../utils/fs-utils');

var path            = require('path');

module.exports = Task.extend({
  project: undefined,

  //Read in the shell index.html file
  getShellTemplate: function() {
    var shellPath = path.join(
      __dirname,
      '../templates/livereload-shell/index.html'
    );

    return fsUtils.read(shellPath, { encoding: 'utf8' });
  },

  createShell: function(outputPath, template, reloadUrl) {
    var regExp = new RegExp('{{liveReloadUrl}}', 'gi');
    template = template.replace(regExp, reloadUrl);
    return fsUtils.write(outputPath, template, 'utf8');
  },

  run: function(reloadUrl) {
    var project = this.project;

    return this.getShellTemplate()
      .then(function(html) {
        var outputPath = path.join(cordovaPath(project), 'www/index.html');

        return this.createShell(outputPath, html, reloadUrl);
      }.bind(this))
      .catch(function(err) {
        return Promise.reject('Error moving index.html for livereload ' + err);
      });
  }
});
