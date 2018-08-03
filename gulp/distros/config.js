var _ = require('underscore');
var path = require('path');
var utils = require('./utils');
var glob = require('glob');

var defaultConfig = {
    dir: 'distros/**',
    destDistroDir: 'bin/distros',
    suffixes: {
        src: '.part',
        dest: '.distro'
    },
    args: {
        pdistro: 'site'
    }
};
var iConfig = defaultConfig;
var distrosNameFiles = glob.sync(path.join(process.gulp_init_cwd, iConfig.dir, '**.part.json'));
var distrosHash = {};
distrosNameFiles.forEach(function(distroPath) {
    var distro = require(distroPath)
    distrosHash[distro.id] = distro;
});

module.exports = {

    config: iConfig,

    getDestPathFromName: function getDestPathFromName(name) {

        return path.join(iConfig.dir, name + iConfig.suffixes.src + '.json');
    },
    get: function get(path, default_value) {
        return utils.getPathFromObject(this.config, path, default_value);
    },
    getDistros: function() {
        return Object.keys(distrosHash);
    },
    getEndpointDistrosNames: function() {
        return _.pluck(_.filter(distrosHash, function(distro){ return !!distro.endpoint}),'id');
    },
    getDistrosNames: function() {
        return _.pluck(distrosHash,'id');
    },

    getDistro: function getDistro(distroId) {
        if(!distrosHash[distroId]) {
            throw new Error('Missing ' + distroId);
        }
        return JSON.parse(JSON.stringify(distrosHash[distroId]));
    }
};