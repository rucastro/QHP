'use strict';

var fs = require('fs');
var path = require('path');
var args = require('yargs').argv;
var _ = require('underscore');
var PackageManager = require('../package-manager');

var result = [];

if(args.name) {
    var moduleName = args.name;

    var naming = require('./naming');
    var config = require('./config');
    var utils = require('./utils');

    process.moduleCreator = {};

    var env = process.moduleCreator;
    env.naming = naming(moduleName).get();
    env.init_dir = __dirname;
    env.src_dir = path.join(env.init_dir, 'src');
    env.bin_dir = path.join(process.gulp_init_cwd, PackageManager.distro.folders.binaries || 'bin', config.get('dirs.bin'));
    env.tpls_dir = path.join(env.init_dir, config.get('dirs.templates'));
    env.module_dir = path.join(env.bin_dir, env.naming.moduleDir);
    env.templates = config.get('templates');
    env.utils = utils;

    var tasks = require('./tasks');

    result = _.keys(tasks);
}
module.exports = result;