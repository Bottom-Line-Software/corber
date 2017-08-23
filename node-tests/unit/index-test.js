'use strict';

var td              = require('testdouble');
var fs              = require('fs');
var expect          = require('../helpers/expect');
var isAnything      = td.matchers.anything;

var stubIndex = function() {
  var stub = require('../../index');
  stub.project = {
    targetIsCordova: true,
    RELOAD_PORT: 1,
    CORDOVA_PLATFORM: 'ios'
  };

  stub._super = {};
  stub._super.treeForPublic = function(tree) { return tree };

  return stub;
};

describe('Index', function() {
  afterEach(function() {
    td.reset();
  });

  context('with target cordova', function() {
    describe('contentFor', function() {
      it('adds a cordova script tag', function() {
        var projectIndex = stubIndex();

        expect(
          projectIndex.contentFor('body')
        ).to.equal(
          '<script src="cordova.js"></script>'
        );
      });
    });

    describe('with target liveReload', function() {
      it('attempts to add cordova assets to tree', function() {
        td.replace(fs, 'existsSync', function() {
          return true;
        });

        var projectIndex = stubIndex();
        var buildTreeDouble = td.replace(projectIndex, 'cordovaAssetTree');
        projectIndex.project.targetIsCordovaLivereload = true;

        projectIndex.treeForPublic()
        td.verify(buildTreeDouble(isAnything()));
      });

      it('first gets cordova asset paths, then validates them', function() {
        /* eslint-disable max-len */
        var cdvAssets = require('../../lib/targets/cordova/utils/cordova-assets');
        td.replace('../../lib/targets/cordova/utils/get-path');
        /* eslint-enable max-len */

        var assetCalls = [];
        td.replace(cdvAssets, 'getPaths', function() {
          assetCalls.push('get-paths');
          return {
            assetsPath: ''
          }
        });
        td.replace(cdvAssets, 'validatePaths', function() {
          assetCalls.push('validate-paths');
        });

        var projectIndex = stubIndex();
        td.replace(projectIndex, '_mergeTrees');
        projectIndex.cordovaAssetTree();

        expect(assetCalls).to.deep.equal(['get-paths', 'validate-paths']);
      });
    });
  });
});
