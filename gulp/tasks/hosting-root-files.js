/* PS CUSTOM - NEW */

'use strict';

var gulp = require('gulp');
var path = require('path');
var zip = require('gulp-zip');
var PackageManager = require('../package-manager');

var folder = 'hosting-root-files';
var baseDir = 'HostingRootFiles';
var folderPatterns = [
    baseDir + '/**/*.*',
    '!' + baseDir + '/SSP Applications{,/**/*.*}'
];

gulp.task('hosting-root-files', function()
{
    return gulp.src(folderPatterns).pipe(gulp.dest(path.join(process.gulp_dest, folder)));
});

gulp.task('hosting-root-files-zip', [], function() {

    if(PackageManager.distro.folders.binaries) {
        return gulp.src(folderPatterns)
            .pipe(zip(folder + '.zip'))
            .pipe(gulp.dest(path.join(PackageManager.distro.folders.binaries)));
    }
});

gulp.task('watch-hosting-root-files', function()
{
    gulp.watch(folderPatterns, ['hosting-root-files']);
});