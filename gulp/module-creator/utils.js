'use strict';

var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var stream = require('stream');
var handlebars = require('handlebars');
var gutil = require('gulp-util');

var utils;

function getPathFromObject(object, configPath, defaultValue) {
    var tokens;
    var prev;
    var n;
    if (!configPath) {
        return object;
    } else if (object) {
        tokens = configPath.split('.');
        prev = object;
        n = 0;

        while (!_.isUndefined(prev) && n < tokens.length) {
            prev = prev[tokens[n++]];
        }

        if (!_.isUndefined(prev)) {
            return prev;
        }
    }
    return defaultValue;
}

function getAllIndexes(arr, val) {
    var indexes = [];
    var i;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            indexes.push(i);
        }
    }
    return indexes;
}

/**
 * types:
 *  "lower" - all parts lower
 *  "upper" - all parts upper
 *  "camel" - all parts capitalized
 *  "first" - first part lower, rest of parts capitalized
 */
function formatStringArray(parts, type, separator, keepDot) {
    var result = _.map(parts, function map(part, index) {
        if (type === 'lower') {
            return part.toLowerCase();
        } else if (type === 'upper') {
            return part.toLowerCase();
        } else if (type === 'capitalize') {
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        } else if (type === 'camel') {
            if (index === 0) {
                return part.toLowerCase();
            }
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        }
        return part;
    }).join(separator);
    if (!keepDot) {
        result = result.replace(new RegExp('\\.', 'g'), '');
    }
    if (separator) {
        result = result.replace(new RegExp(separator + separator, 'g'), separator);
    }
    return result;
}

function variableFriendlyString(str) {
    return str.replace(/[._-]/g, '');
}

function ensureFolder(name) {
    try {
        fs.mkdirSync(name);
    } catch (ex) {
        if (ex.code === 'ENOENT') {
            ensureFolder(path.dirname(name));
            fs.mkdirSync(name);
        } else if (ex.code !== 'EEXIST') {
            throw ex;
        }
    }
}

function getStreamFromString(filename, string) {
    var src = stream.Readable({ objectMode: true });
    src._read = function streamRead() {
        this.push(new gutil.File({
            cwd: '',
            base: '',
            path: filename,
            contents: new Buffer(string)
        }));
        this.push(null);
    };
    return src;
}

function getStringFromTemplate(file, data) {
    var templateString = fs.readFileSync(file, {encoding: 'utf8'});
    var template = handlebars.compile(templateString);
    return template(data);
}

function getStreamFromTemplate(file, data) {
    return getStreamFromString(path.basename(file), getStringFromTemplate(file, data));
}

utils = {
    getPathFromObject: getPathFromObject,
    formatStringArray: formatStringArray,
    variableFriendlyString: variableFriendlyString,
    getAllIndexes: getAllIndexes,
    ensureFolder: ensureFolder,
    getStreamFromString: getStreamFromString,
    getStringFromTemplate: getStringFromTemplate,
    getStreamFromTemplate: getStreamFromTemplate
};

module.exports = utils;