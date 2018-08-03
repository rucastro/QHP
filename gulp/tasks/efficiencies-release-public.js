/*
 @module gulp.copy
 #gulp copy


 /* jshint node: true */

'use strict';

var gulp = require('gulp')
    ,   package_manager = require('../package-manager')
    ,   distro = package_manager.distro
    ,   del = require('del')
    ,   jsonlint = require('jsonlint')
    ,   fs = require('fs')
    ,   args = require('yargs').argv
    ,   gif = require('gulp-if')
    ,   zip = require('gulp-zip')
    ,   config = require('../distros/config')
    ,   compile = require('../distros/compile')
    ,   _ = require('underscore')
    ,   license = require('gulp-header-license')
    ,   async = require('async')
    ,   glob = require("glob")
    ,   gulpSequence = require('gulp-sequence');

var distroFolder = distro.folders.release;
var moduleFolder = distro.folders.release;

var _getAllFilesFromFolder = function(dir) {
    var results = [];
    fs.readdirSync(dir).forEach(function(file) {

        file = dir + '/' + file;
        var stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(_getAllFilesFromFolder(file))
        } else results.push(file);

    });

    return results;
};

gulp.task('efficiencies-release-public', function()
{
   //end.wait('copyright');

    var referenceModules = ['suitecommerce','third_parties'];
    var distroFiles;
    var distros = [];
    var defaultReleaseName;
    var releaseName;
    var releaseAssets = [];
    var pathModule = [];

    if(args.distros){

        distroFiles = args.distros.split(',');


        _.each(distroFiles, function(distroFile,index){
            try
            {
                var pdistros = args.pdistros.split(',');

                var distro = jsonlint.parse(fs.readFileSync(distroFile, {encoding: 'utf8'}));

                distros.push(distro);
                config.getDestPathFromName(pdistros[index]);
                releaseAssets.push(config.getDestPathFromName(pdistros[index]));
                releaseAssets.push(distroFile);
            }
            catch(err)
            {
                err.message = 'Error parsing distro file ' + distroFile + ': ' + err.message;
                throw err;
            }
        });
        defaultReleaseName = args.distros.replace(/.json/gi, '').replace(/,/gi,'_').split('/').join('_');
    } else {
        distros = [package_manager.distro];
        releaseAssets.push(config.getDestPathFromName(args.pdistro));
        releaseAssets.push(args.distro);
        defaultReleaseName = args.distro.replace(/.json/gi, '').replace(/,/gi,'_').split('/').join('_');
    }

    releaseName = args.name || defaultReleaseName;

    var shouldZip = !args.nozip;

    del.sync(distroFolder);
    del.sync(moduleFolder);


    _.each(distros, function(distro){
        _.each(distro.dependencies, function(de){
            releaseAssets.push(config.getDestPathFromName(de));
        });
        _.each(distro.modules, function(v,k){
            var namespace = k.split('/')[0];

            if(!_.contains(referenceModules, namespace)){
                var modulePath = './Modules/' + k + '@' + v +'/';
                _.each(_getAllFilesFromFolder(modulePath), function(path){
                    var folderName = path.split('/')[path.split('/').length - 1];
                    var licenseTxt;

                    if(folderName.split('.').pop() !== 'json') {
                        if (folderName.split('.').pop() !== 'tpl') {
                           licenseTxt = '/*' + (fs.readFileSync('public-license.txt', 'utf8')) + '*/';
                        } else {
                            licenseTxt = '{{!' + (fs.readFileSync('public-license.txt', 'utf8')) +'}}';
                        }
                    }

                    gulp.src(path,{base:"."})
                        .pipe(license(licenseTxt))
                        .pipe(gulp.dest(moduleFolder));
                });

                if(v.indexOf('dev') !==-1){
                    console.warn('BUILDING A DEV RELEASE');
                }
            }
        });
    });

    _.each(distros, function(distro){
        var config = distro.tasksConfig['efficiencies-release'] || {};
        if(config.extras && config.extras.length) {
            releaseAssets = releaseAssets.concat(config.extras);
        }
    });

    releaseAssets = releaseAssets.concat(compile.getDependenciesDistros());
    releaseAssets = _.uniq(releaseAssets);

    var tasks = ['efficiencies-release-fileCleanUp', 'efficiencies-release-zip'];
    gulp.src(releaseAssets,{base:"."})
        .pipe(gulp.dest(distroFolder))
        .on('end', function(){
            gulp.start('efficiencies-release-run-zip')
        });
});

gulp.task('efficiencies-release-run-zip', function (cb) {
  gulpSequence(['efficiencies-release-fileCleanUp', 'efficiencies-release-zip'])(cb);
});