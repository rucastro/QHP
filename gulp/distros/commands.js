/*
 {"prepend": "<Module|Version>"}
 {"append": "<Module|Version>"}
 {"remove": "<Module|Version>"}
 {"add": "<Module|Version>", "before|after": "<Module|ModulePath>"}
 TODO: {"replace": "<Module|Version>", "with": "<Module|ModulePath@Version>"}
 */

var _ = require('underscore');
var utils = require('./utils');

function Commands(parent, elem) {
    this.parent = parent;
    this.elem = elem;
    this.isObject = _.isObject(elem) && !_.isArray(elem);
    this.actions = [];
}
_.extend(Commands.prototype, {

    validCommands: [
        ["remove"],
        ["prepend"],
        ["append"],
        ["add", "before"],
        ["add", "after"]
    ],
    commands: {
        remove: function remove(key, subject) {
            var _this = this;
            if (_this.isObject) {
                delete _this.parent[key];
            } else {
                // do it with find because sass modules can be objects
                var index = utils.getIndexOfModule(_this.parent, subject);
                if (index >= 0) {
                    _this.parent.splice(index, 1);
                } else {
                    console.log('WARNING: Element "' + subject + '" not found while attempting to remove');
                }
            }
        },
        prepend: function prepend(key, subject) {
            var _this = this;
            if (_this.isObject) {
                _this.parent = utils.objectUnshift(_this.parent, key, subject);
            } else {
                _this.parent.unshift(subject);
            }
        },
        append: function append(key, subject) {
            var _this = this;
            if (_this.isObject) {
                _this.elem = utils.objectPush(_this.elem, key, subject);
            } else {
                _this.elem.push(subject);
            }
        },
        addBefore: function addBefore(key, subject, ref) {
            var _this = this;
            var arraySubject = _this.parent;
            if (_this.isObject) {
                arraySubject = _.keys(_this.parent);
            }
            var indexRef = utils.getIndexOfModule(arraySubject, ref);
            if (indexRef >= 0) {
                var index = indexRef;
                if (_this.isObject) {
                    _this.parent = utils.objectSplice(_this.parent, key, subject, index);
                } else {
                    _this.parent.splice(index, 0, subject);
                }
            } else {
                throw new Error('Element "' + ref + '" not found while adding "' + (_this.isObject? key : subject) + '" before it.');
            }
        },
        addAfter: function addAfter(key, subject, ref) {
            var _this = this;
            var arraySubject = _this.parent;
            if (_this.isObject) {
                arraySubject = _.keys(_this.parent);
            }
            var indexRef = utils.getIndexOfModule(arraySubject, ref);
            if (indexRef >= 0) {
                var index = indexRef + 1;
                if (_this.isObject) {
                    _this.parent = utils.objectSplice(_this.parent, key, subject, index);
                } else {
                    _this.parent.splice(index, 0, subject);
                }
            } else {
                throw new Error('Element "' + ref + '" not found while adding "' + (_this.isObject? key : subject) + '" after it.');
            }
        }
    },

    callCommand: function callCommand(command1, command2, args) {
        var _this = this;
        var command = command1 + (command2 ? command2[0].toUpperCase() + command2.slice(1) : '');
        _this.commands[command].apply(_this, args);
    },

    add: function addAction(action, key) {
        var _this = this;
        if(_this.isObject) {
            _this.actions.push({
                key: key,
                action: action
            });
        } else {
            _this.actions.push(action);
        }
    },

    extract: function extract(value, key) {
        var _this = this;
        if (_this.isObject) {
            delete _this.elem[key];
        } else {
            var index = _.indexOf(_this.elem, value);
            if(index >= 0) {
                _this.elem.splice(index, 1);
            } else {
                throw new Error('Unable to find command ' + JSON.stringify(value) + ' to extract from distro.');
            }
        }
    },

    getCommand: function getCommand(action) {
        var _this = this;
        var keys = _.keys(action);
        return _.find(_this.validCommands, function find(command) {
            return (_.intersection(keys, command).length === command.length);
        });
    },

    isCommand: function isCommand(value) {
        var _this = this;
        if (_.isObject(value)) {
            return !!_this.getCommand(value);
        }
        return false;
    },

    parse: function get() {
        var _this = this;
        var clone = _this.isObject ? _.clone(_this.elem) : _this.elem.slice();
        _.each(clone, function each(action, key) {
            if (_this.isCommand(action)) {
                _this.add(action, key);
                _this.extract(action, key);
            }
        });
    },

    executeAll: function executeAll() {
        var _this = this;
        _.each(_this.actions, function each(actionElem) {
            var action = _this.isObject ? actionElem.action : actionElem;
            var key = _this.isObject ? actionElem.key : null;
            _this.execute(action, key);
        });
    },

    execute: function execute(action, key) {
        var _this = this;
        var command = _this.getCommand(action);
        if(command) {
            var commandType = command[0];
            var commandRef = command[1];
            var actionSubject = action[commandType];
            var actionRef = commandRef? action[commandRef] : null;
            // call the method for the command
            _this.callCommand(commandType, commandRef, [key, actionSubject, actionRef]);
        } else {
            throw new Error('Invalid command ' + action);
        }
    },

    compile: function compile() {
        var _this = this;
        if(_this.elem) {
            _this.parse();
            _this.executeAll();
        }
        return {
            parent: _this.parent,
            elem: _this.elem
        };
    }

});

module.exports = Commands;