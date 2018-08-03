/*
 @module gulp.copy
 #gulp copy


 /* jshint node: true */

 'use strict';

var gulp = require('gulp')
    ,   package_manager = require('../package-manager')
    ,   distro = package_manager.distro
    ,   del = require('del')
    ,   fs = require('fs')
    ,   args = require('yargs').argv
    ,   _ = require('underscore')
    ,   glob = require("glob");

var moduleFolder = distro.folders.release;

gulp.task('efficiencies-release-fileCleanUp', function()
{
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
            }
            catch(err)
            {
                err.message = 'Error parsing distro file ' + distroFile + ': ' + err.message;
                throw err;
            }
        });
    } else {
        distros = [package_manager.distro];
    }

    _.each(distros, function(distro){
        var excludeFiles = distro.tasksConfig['efficiencies-release-public'];
        if (excludeFiles) {
            _.each(excludeFiles.exclude, function(v, k) {
                _.each(v, function(removeFiles){
                    var excludeFilesPath = moduleFolder + '/Modules/' + k +'/*/' + removeFiles;
                    var namespace = k.split('/')[0];
                    if(!_.contains(referenceModules, namespace)) {
                        glob(excludeFilesPath, function (er, files) {
                            _.each(files, function(fls) {
                                del.sync(fls);
                            });
                        })
                    }
                });
            });
        }
    });
});
