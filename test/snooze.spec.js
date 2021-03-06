describe('Snooze', function() {
  'use strict';

  var snooze;
  var should = require('should');
  var fse = require('fs-extra');

  beforeEach(function() {
    snooze = require('../index.js');
    snooze.clear();
  });

  it('should be defined', function() {
    snooze.should.not.equal(undefined);
  });

  it('should have no modules', function() {
    snooze.modules.length.should.equal(0);
  });

  it('should have an empty config', function() {
    Object.keys(snooze.config).length.should.equal(0);
  });

  it('should have no module paths', function() {
    Object.keys(snooze.modulePaths).length.should.equal(0);
  });

  it('should defined EntityGroup', function() {
    Object.keys(snooze.EntityGroup).should.not.equal(undefined);
  });

  it('should defined Entity', function() {
    Object.keys(snooze.Entity).should.not.equal(undefined);
  });

  it('should defined Util', function() {
    Object.keys(snooze.Util).should.not.equal(undefined);
  });

  it('should throw a fatal error', function() {
    var thrown = false;
    try {
      snooze.fatal(new Error('fatal error'));
    } catch (e) {
      thrown = true;
    }

    thrown.should.equal(true);
  });

  it('should register a module path', function() {
    snooze.registerModulePath('test', 'test');
    snooze.modulePaths.test.should.equal('test');
  });

  it('should create a module using the createModule method', function() {
    snooze.createModule('test', []);
    snooze.modules.length.should.equal(1);
  });

  it('should create a module using the module method', function() {
    snooze.module('test', []);
    snooze.modules.length.should.equal(1);
  });

  it(
    'should create a and retrieve the created module using the module method',
    function() {
      snooze.module('test', []);
      snooze.module('test').should.not.equal(1);
    });

  it('should load module when no main property exists in package.json',
    function() {

      var data = {
        name: "notExistingModule"
      }

      var dir = __dirname + "/../node_modules/" + data.name;
      var packageJson = dir + "/package.json";
      var indexJs = dir + "/index.js";
      fse.ensureDirSync(dir);
      fse.writeJsonSync(packageJson, data);
      fse.writeJsonSync(indexJs, "module.exports=function(){}");

      var thrown = false;
      try {
        snooze.module('test', ['notExistingModule']);
      } catch (e) {
        thrown = true;
      } finally {
        fse.removeSync(dir);
      }

      thrown.should.equal(false);

    });

  it('should throw defined error when loading non existing module',
    function() {

      var thrown = false;
      var err = null;

      try {
        snooze.module('test', ['notExistingModule']);
      } catch (e) {
        thrown = true;
        err = e;
      }

      thrown.should.equal(true);
      err.message.should.equal(
        "Unable to find submodule in node_modules (recursively): notExistingModule"
      );

    });



});
