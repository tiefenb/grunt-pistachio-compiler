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
    var pistachio = require('pistachio');
    var exec = require('child_process').exec;

    // ==========================================================================
    // TASKS
    // ==========================================================================


  grunt.registerMultiTask('pistachio-compiler', 'Compile pistachio-template Files to .pistachio', function() {
    if(typeof this.file.src === 'undefined') { grunt.warn('Missing src property.'); return false; }
    var srcFiles = file.expandFiles(this.file.src);
    var done = this.async();
    grunt.helper('pistachio-compiler', srcFiles, {}, function(err, compiled, src) {
      if (err) {
        grunt.warn(err);
        done(false);
        return;
      }
      done();
    });

  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

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

};
