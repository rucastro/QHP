
/* jshint node: true */
/*
@module gulp.automation-backend

This task compiles all the libraries and test cases for backend.

##Usage

	gulp browserify
	gulp jasmine-backend
	gulp jasmine-backend-specs
	gulp ssp-libraries-test
*/

'use strict';

var gulp = require('gulp')
,	aliasify = require('aliasify')
,	browserify = require('browserify')
,   buffer = require('vinyl-buffer')
,	concat = require('gulp-concat')
,	del = require('del')
,	insert = require('gulp-insert')
,	glob = require('glob').sync
,	gutil = require('gulp-util')
,	map = require('map-stream')
,	package_manager = require('../package-manager')
,	path = require('path')
,	source = require('vinyl-source-stream')
,	_ = require('underscore')
,	args = require('yargs').argv
;

// Only if we are invoking deploy from the command line.
if (args._.indexOf('backend-tests-deploy') >= 0 && !args.skipCompilation)
{
	process.gulp_dest = process.gulp_dest_deploy;
}

var backend_test_libs = path.join(process.gulp_dest, 'backend-test-libs.js')
,	backend_jasmine = path.join(process.gulp_dest, 'backend-jasmine.js')
,	backend_jasmine_specs = path.join(process.gulp_dest, 'backend-jasmine-specs.js')
,	backend_jasmine_helpers = path.join(process.gulp_dest, 'backend-jasmine-helpers.js')
,	source_files = [ 
			backend_test_libs
		,	backend_jasmine
		,	backend_jasmine_helpers
		,	backend_jasmine_specs
		]
;

var ssp_libraries_output = 'ssp_libraries_backend_tests.js';

// @method generateAliasifyConfig runs an aliasify transform
// to replace a require with some code in a file determined by browserify-replacements. 
// The name of the file corresponds to the name of the require that will be replaced.
// @param {Void}
// @returns {AliasifyConfig} the aliases with the file paths where to find the code to replace
function generateAliasifyConfig()
{
	// @class AliasifyConfig an object with the name of the alias, 
	// and the file path with the code to replace a require('alias')
	var aliasifyConfig = {
		aliases : {}
	,	verbose: false
	};

	var replacements_globs = package_manager.getGlobsFor('backend-tests-browserify-replacements');

	replacements_globs.forEach(function(repGlob)
	{
		var repFiles = glob(repGlob);

		repFiles.forEach(function(file_path)
		{
			var library_name = path.basename(file_path, '.js');
			aliasifyConfig.aliases[library_name] = path.resolve(file_path);
			gutil.log("Replacing lib:", library_name);
		});
	});

	return aliasifyConfig;
}

// @method runBrowserify runs browserify over all the files under browserify-entries.
// It also runs the aliasify transform given by generateAliasifyConfig.
// It replaces the default empty define generated  by browserify by a named one taking the name of the file
// as the name of the package.
// @param {Void}
// @returns {File} the final result will be in backend-test-libs.js inside LocalDistribution folder
function runBrowserify()
{
	var aliasifyConfig = generateAliasifyConfig();

	return gulp
		.src(
			package_manager.getGlobsFor('backend-tests-browserify-entries')
		)
		.pipe(map(function(file, cb_file)
		{
			var module_name = path.basename(file.path, '.js')
			,	processed_file = null;

			gutil.log("Browserifying:", module_name);
			
			return browserify(file.path, { 
				standalone: module_name
			,	tranform: [

				] })
				.transform(aliasify, aliasifyConfig)
				.bundle()
				.on('error', function(error)
		        {
		            gutil.log(gutil.colors.red('Browserify error:'), error.message);
		            gutil.beep();
		            this.emit('end'); // Ends the task
		        })
				.pipe(source(module_name + '.js'))
				.pipe(buffer())
				.pipe(map(function(compiled_file, compiled_cb)
				{
					var new_content = compiled_file.contents.toString();
					new_content = new_content.replace('&&define.amd){define([]', "&&define.amd){define('" + module_name + "', []");

					compiled_file.contents = new Buffer(new_content);
					processed_file = compiled_file;
					
					compiled_cb(null, compiled_file);
				}))
				.on('end', function()
				{
					cb_file(null, processed_file);
				});
		}))
		.pipe(concat(path.basename('backend-test-libs.js')))
		.pipe(gulp.dest(process.gulp_dest));
}

// @method compileJasmine concatenates all the libraries required
// to run jasmine in backend.
// This includes jasmine standalone, and others defined by ssp-libraries-test.
// @param {Void}
// @returns {File} the final result will be in backend-jasmine.js inside LocalDistribution folder
function compileJasmine()
{
	var jasmine_module = _.findWhere(
		package_manager.contents, { moduleName: 'jasmine' }
	);

	var jasmine_path = path.join(jasmine_module.baseDir, 'lib', 'jasmine-2.3.2', 'jasmine.js')
	,	jasmine_libs = package_manager.getGlobsFor('backend-tests-jasmine-libs');

	var shims_index  = jasmine_libs.findIndex(function(fpath)
	{
		return path.basename(fpath) === 'Shims.js';
	});

	jasmine_libs.splice(shims_index + 1, 0, jasmine_path);

	// concat jasmine.js library and then the rest of the tests
	return gulp.src(jasmine_libs)
		.pipe(concat(path.basename(backend_jasmine)))
		.pipe(gulp.dest(process.gulp_dest));
}

// @method compileSpecs concatenates all the specs that run in backend under
// the package ssp-libraries-test-cases.
// @param {Void}
// @returns {File} the final result will be in backend-jasmine-specs.js inside LocalDistribution folder
function compileSpecs()
{
	return gulp.src(package_manager.getGlobsFor('backend-tests'))
		.pipe(concat(path.basename(backend_jasmine_specs)))
		.pipe(gulp.dest(process.gulp_dest));
}


// compile browserifys in LocalDistribution/backend-test-libs.js
gulp.task('backend-tests-compile-libs', [], runBrowserify);

// compile jasmine in LocalDistribution/backend-jasmine.js
gulp.task('backend-tests-compile-jasmine', [], compileJasmine);

// compile specs in LocalDistribution/backend-jasmine-specs.js
gulp.task('backend-tests-compile-specs', [
	'backend-tests-compile-jasmine'
], compileSpecs);


gulp.task('backend-tests-compile-helpers', [], function()
{
	return gulp.src(package_manager.getGlobsFor('backend-tests-jasmine-helpers'))
		.pipe(concat(path.basename(backend_jasmine_helpers)))
		.pipe(insert.wrap('(function(){ var Preconditions = require("preconditions");', '})();'))
		.pipe(gulp.dest(process.gulp_dest))
	;
});

// parent task to compile all the libraries, getting a unique ssp-libraries-test.js file
// to upload along with the ssp-libraries.js
gulp.task('backend-tests-compile', [
	'backend-tests-compile-libs'
,	'backend-tests-compile-helpers'
,	'backend-tests-compile-specs'
], function()
{
	var dstOutput = path.join(process.gulp_dest, ssp_libraries_output);

	return gulp.src(source_files)
		.pipe(concat(ssp_libraries_output))
		.pipe(gulp.dest(process.gulp_dest))
		.on('end', function()
		{
			gutil.log("");
			gutil.log("Compiled tests and libraries output:")
			gutil.log("");

			gutil.log(gutil.colors.yellow(
				path.relative(process.cwd(), dstOutput))
			);

			gutil.log("")
			gutil.log("Register it in SSP Libraries of your SSP Application.")
			gutil.log("");

			del.sync(source_files);
		});
});

// additional task to clean intermediate files
gulp.task('backend-tests-clean', function()
{
	return del(source_files);
});