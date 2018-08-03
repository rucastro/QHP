/*
 @module gulp.copy
 #gulp copy


 /* jshint node: true */
'use strict';

var gulp = require('gulp')
	,	package_manager = require('../package-manager')
	,	distro = package_manager.distro
	,	del = require('del')
	,	jsonlint = require('jsonlint')
	,	fs = require('fs')
	,	args = require('yargs').argv
	,	gif = require('gulp-if')
	,	zip = require('gulp-zip')
	,	config = require('../distros/config')
	,	compile = require('../distros/compile')
	,	_ = require('underscore');

var releaseFolder = distro.folders.release;

gulp.task('efficiencies-release', function()
{
	var referenceModules = ['suitecommerce','third_parties'];
	var distroFiles;
	var distros = [];
	var defaultReleaseName;
	var releaseName;
	var releaseAssets = [];
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

	del.sync(releaseFolder);

	_.each(distros, function(distro){
		_.each(distro.dependencies, function(de){
			releaseAssets.push(config.getDestPathFromName(de));
		});
		_.each(distro.modules, function(v,k){

			var namespace = k.split('/')[0];
			if(!_.contains(referenceModules, namespace)){
				var modulePath = './Modules/' + k + '@' + v +'/**';
				releaseAssets.push(modulePath);

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

	var shouldZip = !args.nozip;

	if(!shouldZip){
		releaseFolder += '/' + releaseName;
	}


	return gulp.src(releaseAssets,{base:"."})
		.pipe(gif(shouldZip, zip(releaseName+'.zip')))
		.pipe(gulp.dest(releaseFolder));

});
