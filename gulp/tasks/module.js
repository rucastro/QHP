'use strict';

// TODO output it to Modules folder
// TODO use preprocess for templating: https://github.com/jsoverson/preprocess
// TODO unify task definition in 'tasks.js' with its task names and files in 'naming.js'
// TODO improve structure of naming variable
// TODO add service, ssp-libraries, images, assets, etc.
// TODO allow additional params to control output
// TODO move configurations to distro

var gulp = require('gulp');
var _ = require('underscore');
var tasks = require('../module-creator');
var args = require('yargs').argv;

var dependencies = _(tasks).map(function map(task) {
    return 'module-' + task;
});

gulp.task('module', dependencies, function() {
    if(!args.name) {
        throw new Error('Module Creator parameter missing: --name')
    }
});