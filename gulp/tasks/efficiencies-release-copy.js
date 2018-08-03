/*
 @module gulp.copy
 #gulp copy


 /* jshint node: true */

'use strict';

var gulp = require('gulp')
    ,   package_manager = require('../package-manager')
    ,   distro = package_manager.distro
    ,   args = require('yargs').argv
    ,   del = require('del');

var releaseFolder = distro.folders.release;
var releaseFolder2 = distro.folders.release;
var tempFolder = 'TempReleaseFolder';

gulp.task('efficiencies-release-copy', function () {
  var releaseName;
  var defaultReleaseName;

  defaultReleaseName = args.distro.replace(/.json/gi, '').replace(/,/gi,'_').split('/').join('_');

  releaseName = args.name || defaultReleaseName;

  del.sync(releaseFolder);

  var shouldZip = !args.nozip;

  if(!shouldZip) {
       releaseFolder += '/' + releaseName;
  }

  gulp.src(tempFolder + "/**/*")
      .pipe(gulp.dest(releaseFolder2))
      .on('end', function(cb) {
        del.sync(tempFolder)
    });
});