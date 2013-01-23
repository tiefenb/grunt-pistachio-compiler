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

  function parseFile(file, opts) {
    var tpl, base = opts.file;
    if (file[0]==='/') file = path.resolve(opts.root || '/', file.substr(1));
    file = base ? path.resolve(path.dirname(base), file) : path.resolve(file);
    try {
      tpl = fs.readFileSync(file, 'utf-8');
    } catch(ex) {
      throw new Error('Could not open file: '+file);
    }
    opts.file = file;
    tpl = pistachio.parse(tpl, opts);
    opts.file = base;
    return tpl;
  }

  grunt.registerMultiTask('pistachio-compiler', 'Compile pistachio-template Files to .pistachio', function() {
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

    files.forEach(function(file, cb) {
      if (!file) return;
      console.log('Compiling ', file.src, '=>', file.target);
      try {
        var input = grunt.file.read(file.src, { encoding:'utf-8' });
        var fn = pistachio.compile(pistachio.parse(input, { partials:parseFile, file:file.src }));
        grunt.file.write(file.target, fn, { encoding:'utf-8' });
      } catch(ex) {
        grunt.warn(ex.message);
      }
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
