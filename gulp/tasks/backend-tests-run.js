'use strict';

var gulp = require('gulp')
,	package_manager = require('../package-manager')
,	path = require('path')
,	_ = require('underscore')
;

function getAutomationCorePath(rel_path)
{
	var automation_core_module = _.findWhere(
		package_manager.contents, { moduleName: 'Automation.Core' }
	);

	var old_automation_core_module = _.findWhere(
		package_manager.contents, { moduleName: 'AutomationCore' }
	);

	if (!!automation_core_module && !!old_automation_core_module)
	{
		console.log(
		  'Incompatible modules, you cannot have AutomationCore and ' + 'Automation.Core in the same distribution'
		);
		process.exit(1);
	}

	automation_core_module = automation_core_module || old_automation_core_module;

	if (!automation_core_module)
	{
		console.log('Unable to find "Automation.Core" Module.');
		process.exit(1);
	}

	var automation_core_path = path.join(automation_core_module.absoluteBaseDir, 'BackendTests');

	if (rel_path)
	{
		automation_core_path = path.join(automation_core_path, rel_path);
	}

	return automation_core_path;
}


function executeTests ()
{
	var test_runner = require(getAutomationCorePath(
		path.join('Lib', 'TestRunner'))
	);

	test_runner.runTestCases();
}


gulp.task('backend-automation', executeTests);
gulp.task('backend-tests-run', executeTests);
gulp.task('backend-tests', executeTests);
