'use strict';

var args = require('yargs').argv
,	_ = require('underscore')
,	fs = require('fs')
,	gulp = require('gulp')
,	inquirer = require('inquirer')
,	shell = require('shelljs')
,	package_manager = require('../package-manager')
,	path = require('path')
,	Uploader = require('ns-uploader')
,	CredentialsInquirer = require('credentials-inquirer')
,	Progress = require('progress');
;

var services_dest = path.join(process.gulp_dest, '/services')
,	nsdeploy_path = path.join(process.gulp_init_cwd, '.nsdeploy');

// Only if we are invoking deploy from the command line.
if (args._.indexOf('backend-tests-deploy') >= 0 && !args.skipCompilation)
{
	process.gulp_dest = process.gulp_dest_deploy;
	if (!args.skipCompilation)
	{
		shell.rm('-rf', process.gulp_dest);
		shell.mkdir('-p', process.gulp_dest);
	}
}

function getHostname(credentials)
{
	if (credentials.molecule)
	{
		return 'https://rest.' + credentials.molecule + 'netsuite.com';
	}
	if (credentials.vm)
	{
		return credentials.vm;
	}
	else
	{
		return 'https://rest.netsuite.com';
	}
}

function compileServices(cb)
{
	return gulp.src(package_manager.getGlobsFor('backend-tests-services'))
		.pipe(gulp.dest(services_dest));
}

function deployUsingNSDeploy(cb)
{
	var credentials = JSON.parse(fs.readFileSync(nsdeploy_path));

	credentials.vm = args.vm || credentials.vm;
	credentials.molecule = args.m || credentials.molecule;
	credentials.nsVersion = args.nsVersion;
	credentials.applicationId = args.applicationId;
	credentials.roleId = credentials.roleId || credentials.role;

	if(!credentials.password)
	{
		inquirer.prompt(
		{
				type: 'password'
			,	name: 'password'
			,	message: 'Password'
			,	validate: function(input)
				{
					return input.length > 0 || 'Please enter a password';
				}
			}
		,	function(answers)
			{
				credentials.password = answers.password;
				upload(credentials, cb);
			}
		);
	}
	else
	{
		upload(credentials, cb);
	}
}

function deployUsingInquirer(cb)
{
	var credentialsInquirer = new CredentialsInquirer();

	credentialsInquirer.credentials.vm = args.vm;
	credentialsInquirer.credentials.molecule = args.m;
	credentialsInquirer.credentials.nsVersion = args.nsVersion;
	credentialsInquirer.credentials.applicationId = args.applicationId;

	credentialsInquirer.main()
	.then(function()
	{
		var jsUploaderCredentials = credentialsInquirer.getAsNsUploader(credentialsInquirer.credentials);

		var credentials = {
			email: jsUploaderCredentials.email
		,	password: jsUploaderCredentials.password
		,	role: jsUploaderCredentials.roleId
		,	roleId: jsUploaderCredentials.roleId
		,	account: jsUploaderCredentials.account
		,	molecule: jsUploaderCredentials.molecule
		,	vm: jsUploaderCredentials.vm
		,	nsVersion: jsUploaderCredentials.nsVersion
		,	applicationId: jsUploaderCredentials.applicationId
		,	target_folder: jsUploaderCredentials.target_folder
		,	distroName: package_manager.distro.name
		,	hostname: getHostname(jsUploaderCredentials)
		};

		upload(credentials, cb);
	})
	.catch(function(err)
	{
		console.log('Error obtaining credentials: ', err, err.stack, '.\nDeploy aborted. '); 
	});
}

function upload(credentials, cb)
{
	var t0 = new Date().getTime()
	,	uploader = new Uploader(credentials)
	,	bar;

	var config = {
		targetFolderId: credentials.target_folder
	,	sourceFolderPath: process.gulp_dest_deploy
	};
	
	uploader.addProgressListener(function(actual, total)
	{
		if(!bar)
		{
			bar = new Progress('Uploading [:bar] :percent', {
				complete: '='
			,	incomplete: ' '
			,	width: 50
			,	total: total
			});
		}
		bar.tick(1);
	});	
	
	uploader
	.main(config)
	.then(function (manifest)
	{
		var took = ((new Date().getTime() - t0)/1000/60) + '';
		took = took.substring(0, Math.min(4, took.length)) + ' minutes';
		console.log('Deploy finished, took', took);

		if (!fs.existsSync(nsdeploy_path)) 
		{
			delete credentials.password;
			fs.writeFileSync(nsdeploy_path, JSON.stringify(credentials, null, 4));
		}
		
		cb();
	})
	.catch(function(err)
	{
		console.log('ERROR in deploy', err, err.stack, '.\nDeploy aborted. ');
	});
}

function deployBackendTests(cb)
{
	if (fs.existsSync(nsdeploy_path)) 
	{
		deployUsingNSDeploy(cb);
	}
	else
	{
		deployUsingInquirer(cb);
	}
}

gulp.task('backend-tests-deploy', ['backend-tests-services', 'backend-tests-compile'], deployBackendTests);
gulp.task('backend-tests-services', compileServices);