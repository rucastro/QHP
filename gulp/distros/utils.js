'use strict';

var _ = require('underscore');
var fs = require('fs');

function merge(first, second) {
    return _.union(first, second);
}

function extend() {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false,
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        push = Array.prototype.push,
        slice = Array.prototype.slice,
        trim = String.prototype.trim,
        indexOf = Array.prototype.indexOf,
        class2type = {
            "[object Boolean]": "boolean",
            "[object Number]": "number",
            "[object String]": "string",
            "[object Function]": "function",
            "[object Array]": "array",
            "[object Date]": "date",
            "[object RegExp]": "regexp",
            "[object Object]": "object"
        },
        jQuery = {
            isFunction: function (obj) {
                return jQuery.type(obj) === "function"
            },
            isArray: Array.isArray ||
            function (obj) {
                return jQuery.type(obj) === "array"
            },
            isWindow: function (obj) {
                return obj != null && obj == obj.window
            },
            isNumeric: function (obj) {
                return !isNaN(parseFloat(obj)) && isFinite(obj)
            },
            type: function (obj) {
                return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
            },
            isPlainObject: function (obj) {
                if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
                    return false
                }
                try {
                    if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                        return false
                    }
                } catch (e) {
                    return false
                }
                var key;
                for (key in obj) {}
                return key === undefined || hasOwn.call(obj, key)
            }
        };
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
    }
    if (typeof target !== "object" && !jQuery.isFunction(target)) {
        target = {}
    }
    if (length === i) {
        target = this;
        --i;
    }
    for (i; i < length; i++) {
        if ((options = arguments[i]) != null) {
            for (name in options) {
                src = target[name];
                copy = options[name];
                if (target === copy) {
                    continue
                }
                if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : []
                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }
                    if(jQuery.isArray(clone) && jQuery.isArray(copy)) {
                        target[name] = merge(clone, copy);
                    } else {
                        // WARNING: RECURSION
                        target[name] = extend(deep, clone, copy);
                    }
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}

function smartReduceArray(data, idKeyName) {
    var reduced = [];
    data.forEach(function(elem) {
        if(elem && elem.dependencies) {
            elem.dependencies = _.uniq(elem.dependencies,false);
        }
    });

    return data;
}

function ensureDirExists(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 484;
    }
    fs.mkdir(path, mask || 484, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}

function getPathFromObject(object, path, default_value) {
    if (!path) {
        return object;
    } else if (object) {
        var tokens = path.split('.');
        var prev = object;
        var n = 0;

        while (!_.isUndefined(prev) && n < tokens.length) {
            prev = prev[tokens[n++]];
        }

        if (!_.isUndefined(prev)) {
            return prev;
        }
    }
    return default_value;
}

function getIndexOfModule(arr, value) {
    var index = -1;
    _.find(arr, function find(val, i) {
        if (!_.isString(val) && _.isObject(val) && !_.isArray(val)) {
            val = val.module;
        }
        if (val === value) {
            index = i;
            return true;
        }
        return false;
    });
    return index;
}

function objectUnshift(obj, key, value) {
    var pairs = _.pairs(obj);
    pairs.unshift([key, value]);
    return _.object(pairs);
}
function objectPush(obj, key, value) {
    var pairs = _.pairs(obj);
    pairs.push([key, value]);
    return _.object(pairs);
}
function objectSplice(obj, key, value, index) {
    var pairs = _.pairs(obj);
    pairs.splice(index, 0, [key, value]);
    return _.object(pairs);
}

module.exports = {
    extend: extend,
    merge: merge,
    smartReduce: smartReduceArray,
    ensureDirExists: ensureDirExists,
    getPathFromObject: getPathFromObject,
    getIndexOfModule: getIndexOfModule,
    objectUnshift: objectUnshift,
    objectPush: objectPush,
    objectSplice: objectSplice
};