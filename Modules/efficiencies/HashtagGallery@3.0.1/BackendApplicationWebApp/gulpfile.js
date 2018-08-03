var gulp = require('gulp');
var spa = require('gulp-spa');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');

var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');
var http = require('http');
var replace = require('gulp-replace');
var minifyInline = require('gulp-minify-inline');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var gutil = require('gulp-util');


gulp.task('templates', function() {
    gulp.src('src/templates/*.hbs')
        .pipe(handlebars())
        .on('error', gutil.log)
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'Application.templates',
            noRedeclare: true // Avoid duplicate declarations
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('src/js/'));
});

gulp.task('watch-templates', ['templates'],function()
{
    gulp.watch('./src/**/*hbs', ['templates']);
});

gulp.task('fonts-deploy', [], function() {
    gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./DeployDistribution/fonts'));
});
gulp.task('fonts-local', [], function() {
    gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./LocalDistribution/fonts'));
});
gulp.task('img-deploy', [], function() {
    gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./DeployDistribution/img'));
});
gulp.task('img-local', [], function() {
    gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./LocalDistribution/img'));
});

gulp.task('build', ['templates', 'fonts-deploy', 'img-deploy'], function task() {
    'use strict';
    return gulp.src('./src/index.html')
        .pipe(spa.html({
            assetsDir: './src/',
            pipelines: {
                main: function main(files) {
                    // this gets applied for the HTML file itself
                    return files
                        .on('error', gutil.log)
                        .pipe(replace(/(<script.+src=")(?!http:\/\/)(.*?)"/g, '$1' + '{{bundlepath}}' + '$2"'))
                        .pipe(replace(/(<link rel="stylesheet".+href=")(?!http:\/\/)(.*?)"/g, '$1' + '{{bundlepath}}' + '$2"'))
                        .pipe(htmlmin());
                },

                js: function js(files) {
                    return files
                        .pipe(uglify())
                        .pipe(concat('js/app.js'));
                       // .pipe(rev());
                },

                css: function css(files) {
                    return files
                        .on('error', gutil.log)
                        .pipe(minifyCss())
                        .pipe(concat('css/app.css'));
                    //    .pipe(rev());
                }
            }
        })).pipe(gulp.dest('./DeployDistribution/'));
});

gulp.task('build-local', ['templates', 'img-local', 'fonts-deploy'], function task() {
    'use strict';
    return gulp.src('./src/index.html')
        .on('error', gutil.log)
        .pipe(spa.html({
            assetsDir: './src/',
            pipelines: {
                main: function main(files) {
                    // this gets applied for the HTML file itself
                    return files
                        .on('error', gutil.log)
                        .pipe(replace(/(<script.+src=")(?!http:\/\/)(.*?)"/g, '$1' + 'http://localhost:3000/' + '$2"'))
                        .pipe(replace(/(<link rel="stylesheet".+href=")(?!http:\/\/)(.*?)"/g, '$1' + 'http://localhost:3000/' + '$2"'))
                        .pipe(htmlmin());
                }
            }
        })).pipe(gulp.dest('./LocalDistribution/'));
});

gulp.task('watch-js', ['build-local'],function()
{
    gulp.watch('./src/**/*.js', ['build-local']);
});

gulp.task('watch-css', ['build-local'],function()
{
    gulp.watch('./src/**/*.css', ['build-local']);
});


gulp.task('local', ['watch-templates', 'watch-js', 'watch-css'], function local() {
    'use strict';
    var serve = serveStatic('LocalDistribution', {'index': ['index.html', 'index.htm']});

// Create server for static content
    var server = http.createServer(function(req, res) {
        var done = finalhandler(req, res);
        serve(req, res, done);
    });

    // Listen
    server.listen(3000);
});