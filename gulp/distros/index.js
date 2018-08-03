'use strict';

/**
 * HANDLE ENVIRONMENTS
 */

var path = require('path');
var args = require('yargs').argv;
var _ = require('underscore');
var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var utils = require('./utils');
var config = require('./config');
var compile = require('./compile').compile;


function processDistro(distroConfig) {
    var rootPath = process.gulp_init_cwd;

    var distro = compile(distroConfig.id);
    var destFileContent = JSON.stringify(distro, null, 4);
    var destDistroDir = path.join(rootPath,config.get('destDistroDir') );
    var filename = distroConfig.id + config.get('suffixes.dest') + '.json';
    var distrosPath = rootPath;
    _.each(config.get('destDistroDir').split('/'), function(folder) {
        distrosPath = path.join(distrosPath,folder);
        try {
            fs.mkdirSync(distrosPath);
        } catch (e) {

        }
    });


    fs.writeFileSync(path.join(destDistroDir, filename), destFileContent);
    return filename;
}


function processDistros() {
    var pdistros =  (args.pdistros && args.pdistros.split(',')) || [args.pdistro];
    var finalDistros = [];
    _.each(pdistros, function(pdistro){
        var distro = config.getDistro(pdistro)
        processDistro(distro);
        var finalDistro = path.join(config.get('destDistroDir'), distro.id + config.get('suffixes.dest') + '.json');
        finalDistros.push(finalDistro);
        console.log(gutil.colors.cyan('Distro ' + finalDistro + ' generated sucesfully'));
    });

    if(finalDistros.length === 1){
        args.distro = finalDistros[0];
        args.distroId = finalDistros[0];
    } else {
        args.distros = finalDistros.join(',');
    }
    args.distro = finalDistros[0];
}



function validateArguments() {

    if(args.distro && args.pdistro && !args.firstTimeValidated) {
        throw new Error(gutil.colors.red('You must specify either a distro, or a p(artial)distro to be compiled'));
    }
    args.firstTimeValidated = true;

    _.defaults(args, config.get('args'));
    var endpoints = config.getEndpointDistrosNames();
    var pdistros =  (args.pdistros && args.pdistros.split(',')) || [args.pdistro];


    if(pdistros.length) {
        _.each(pdistros, function (pdistro){
            if (_.contains(config.getEndpointDistrosNames(), pdistro) || (_.contains(config.getDistrosNames(), pdistro) && args.endpoint)) {

                if (_.contains(config.getDistrosNames(), pdistro) && args.endpoint) {
                    console.log(gutil.colors.cyan('Compiling ' + pdistro + ' as endpoint'));
                }
            } else {
                throw new Error(gutil.colors.red('Invalid distro "' + pdistro + '" provided. Valid distros are: "' + endpoints.join('","') + '"'));
            }
        });
    }

}

function generateDistros() {
    validateArguments();
    processDistros();
}

module.exports = {
    config: config,
    generate: generateDistros
};