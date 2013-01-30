module.exports = function(grunt) {
    // Grunt utilities.
    var task = grunt.task;
    var file = grunt.file;
    var utils = grunt.utils;
    var log = grunt.log;
    var verbose = grunt.verbose;
    var fail = grunt.fail;
    var option = grunt.option;
    var config = grunt.config;
    var template = grunt.template;

    // external dependencies
    var fs = require('fs');
    var path = require('path');
    var pistachio = require('pistachio');
    var exec = require('child_process').exec;
    var async = require('async');
    // ==========================================================================
    // TASKS
    // ==========================================================================

  grunt.registerMultiTask('pistachio-compiler', 'Compile pistachio-template Files to .pistachio', function() {
    var callback = this.async();

    var files = this.data.files.map(function(file, idx) {
      if (!file.src || !file.src.length) {
        return grunt.warn('Missing source property in file['+idx+']') && false;
      }
      if (!file.dest) {
        return grunt.warn('Missing dest property in file['+idx+']') && false;
      }
      return {
        src:path.resolve(file.src[0]),
        target:path.resolve(file.dest)
      };
    });
    async.forEach(files, function(file, callback) {
      pistachio.load(file.src, undefined, {}, function(err, code) {
        if (err) {
          err.source = file.src;
          err.target = file.target;
          return callback(err);
        }
        grunt.file.write(file.target, code, { encoding:'utf-8' });
        return callback();
      });
    }, function(err) {
      if (err) {
        grunt.warn('Error: '+err.source+' => '+err.target+'\n    '+err.message);
      }
      callback(err);
    });
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================
/*
  grunt.registerHelper('pistachio-compiler', function(srcFiles, options, callback) {
    var compileFile = function(src, callback) {
        verbose.writeln('Parsing ' + src);
        var command = 'pistachio ' + src;
        exec(command, function(err, stdout, stderr) {
          if (err) {
            grunt.warn(err);
          }
          if (stdout) {
            file.write(src.replace(/\.tpl/g, '.pistachio'), stdout);
            callback(null, true);
          }
        });
    };

    utils.async.map(srcFiles, compileFile, function(err, success) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, success);
    });
  });
*/
};
