'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var path = require('path');
var _ = require('underscore');

var env = process.moduleCreator;
var utils = env.utils;
var naming = env.naming;

var tasks = {
    'package': {prefix: '', suffix: '.json', dir: ''},
    entry: {prefix: '', suffix: '.js', dir: 'JavaScript'},
    router: {prefix: '', suffix: '.js', dir: 'JavaScript'},
    template: {prefix: '', suffix: '.tpl', dir: 'Templates'},
    view: {prefix: '', suffix: '.js', dir: 'JavaScript'},
    sass: {prefix: '_', suffix: '.scss', dir: 'Sass'}
};

_(tasks).each(function each(task, name) {
    gulp.task('module-' + name, function gulpTask() {
        var file = path.join(env.tpls_dir, env.templates[name]);
        return utils.getStreamFromTemplate(file, naming)
            .pipe(concat(task.prefix + naming[name + 'File'] + task.suffix))
            .pipe(gulp.dest(path.join(env.module_dir, task.dir)));
    });
});

module.exports = tasks;