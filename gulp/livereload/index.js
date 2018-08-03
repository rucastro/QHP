var args = require('yargs').argv;
var livereload = require('gulp-livereload');
var package_manager = require('../package-manager');
var https = require('./https');

// only get livereload config if task is 'local'

var config = package_manager.getTaskConfig('local.livereload', { enable: false });
config.enable = config.enable && args._ && args._[0] === 'local';

module.exports = {
    isSecureSetup: false,
    config: config,
    isEnabled: function() {
        return config && config.enable;
    },
    isEnabledForTask: function(task) {
        return config && config.enable && config.tasks && config.tasks[task];
    },
    getPort: function() {
        return config.config.port || 35729;
    },
    getSecurePort: function() {
        return config.secure.port || 35731;
    },
    getForGulp: function() {
        if (!this.isSecureSetup) {
            this.isSecureSetup = true;
            https();
        }
        return livereload(config.config);
    }
};