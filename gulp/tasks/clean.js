/*
@module gulp.clean

This will clean up all generated files, mainliy these are the folders Distribution and Deploy. 

##Usage

	gulp clean

*/

var	gulp = require('gulp')
,	del = require('del')
,	path = require('path')
,	distrosConfig = require('../distros/config');

var distrosPattern = path.join(process.gulp_init_cwd, distrosConfig.get('destDistroDir'),'/*');

gulp.task('clean', function(cb)
{
	'use strict';

	del([process.gulp_dest_distro, process.gulp_dest_deploy, distrosPattern,'bin/*'], function (err)
	{
		cb(err);
	});
});