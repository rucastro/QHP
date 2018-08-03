/*
 @module gulp.copy
 #gulp copy


 /* jshint node: true */

 'use strict';

var gulp = require('gulp')
    ,   package_manager = require('../package-manager')
    ,   distro = package_manager.distro
    ,   zip = require('gulp-zip')
    ,   args = require('yargs').argv
    ,   gif = require('gulp-if')
    ,   gulpSequence = require('gulp-sequence');

var releaseFolder = distro.folders.release;

var tempFolder = 'TempReleaseFolder';

gulp.task('efficiencies-release-zip', function () {
    var releaseName;
    var defaultReleaseName;
    var releaseFolder2 = distro.folders.release;

    defaultReleaseName = args.distro.replace(/.json/gi, '').replace(/,/gi,'_').split('/').join('_');

    releaseName = args.name || defaultReleaseName;

    var shouldZip = !args.nozip;

    if(!shouldZip) {
         releaseFolder += '/' + releaseName;
    }

    gulp.src(releaseFolder2 + '/**')
        .pipe(gif(shouldZip, zip(releaseName + '.zip')))
        .pipe(gulp.dest(tempFolder))
        .on('end', function(cb){
            gulp.start('efficiencies-release-run-copy')
    });

});

gulp.task('efficiencies-release-run-copy', function (cb) {
  gulpSequence(['efficiencies-release-copy'])(cb);
});