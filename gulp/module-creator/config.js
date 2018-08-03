'use strict';

var utils = require('./utils');

module.exports = {

    config: {
        namings: {
            version: 'dev',
            view: 'View',
            router: 'Router'
        },
        dirs: {
            src: 'src',
            bin: 'modules',
            templates: 'templates'
        },
        templates: {
            'package': 'ns.package.json',
            entry: 'entry.js',
            router: 'router.js',
            view: 'view.js',
            sass: 'styles.scss',
            template: 'template.tpl'
        }
    },

    get: function get(path, defaultValue) {
        return utils.getPathFromObject(this.config, path, defaultValue);
    }
};