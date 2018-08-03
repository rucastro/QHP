/**
 * Format of moduleName must Pascal case, with optional dot "." separators:
 * No underscore "_" or dashes "-" accepted.
 * If several uppercase together, they will be considered grouped.
 *
 * Examples:
 *      MyModule -> my-module
 *      MyModule.Rocks -> my-module-rocks
 *      JGModuleRocks -> jgmodule-rocks
 */

'use strict';

var config = require('./config');
var utils = require('./utils');
var _ = require('underscore');

module.exports = function namingModule(moduleName) {
    var _this = {};

    var regex = /(\.|[A-Z]+[a-z]+)/g;

    // sample moduleName: MYOwnModuleReally.Rocks
    _this.parts = moduleName.match(regex); // ["MYOwn", "Module", "Really", ".", "Rocks"]

    _this.module = {
        original: moduleName, // MYOwnModuleReally.Rocks
        standard: _this.parts.join(''), // MYOwnModuleReally.Rocks (filters any _ or -)
        camelCase: utils.formatStringArray(_this.parts, 'camel', '', false), // myownModuleReallyRocks
        pascalCase: utils.formatStringArray(_this.parts, 'capitalize', '', true), // MyownModuleReally.Rocks
        lispCase: utils.formatStringArray(_this.parts, 'lower', '-', false), // myown-module-really-rocks
        macroCase: utils.formatStringArray(_this.parts, 'upper', '_', true), // MYOWN_MODULE_REALLY.ROCKS
        snakeCase: utils.formatStringArray(_this.parts, 'lower', '_', false) // myown_module_really_rocks
    };

    _this.variables = {};

    _this.parse = function parse() {
        var module = _this.module;
        var variables = _this.variables;
        var naming = config.get('namings');

        variables.moduleDir = module.standard + '@' + naming.version;
        variables.moduleName = module.standard; // MYOwnModuleReally.Rocks
        variables.moduleClass = utils.variableFriendlyString(module.standard); // MYOwnModuleReally.Rocks
        variables.packageFile = 'ns.package';
        variables.entryFile = module.standard; // MYOwnModuleReally.Rocks
        variables.routerFile = module.standard + '.' + naming.router; // MYOwnModuleReally.Rocks.Router
        variables.routerClass = utils.variableFriendlyString(variables.routerFile); // MYOwnModuleReallyRocksRouter
        variables.routerUrl = module.lispCase; // myown-module-really-rocks
        variables.routerName = module.camelCase; // myownModuleReallyRocks
        variables.viewFile = module.standard + '.' + naming.view; // MYOwnModuleReally.Rocks.View
        variables.viewClass = utils.variableFriendlyString(variables.viewFile); // MYOwnModuleReallyRocksView
        variables.template = module.snakeCase; // myown_module_really_rocks
        variables.templateFile = module.snakeCase; // myown_module_really_rocks
        variables.templateVar = module.camelCase; // myown_module_really_rocks
        variables.sassFile = module.lispCase; // myown-module-really-rocks
        variables.sassClass = module.lispCase; // myown-module-really-rocks
    };

    _this.get = function get(type) {
        if (type) {
            return _this.variables[type];
        }
        return _this.variables;
    };

    _this.parse();

    return _this;
};