var path = require('path');
var _ = require('underscore');
var config = require('./config');
var utils = require('./utils');
var Commands = require('./commands');

function compileCommands(parent, elem) {
    var commands = new Commands(parent, elem);
    var result = commands.compile();
    return result;
}

var dependenciesDistrosArray = [];



//https://gist.github.com/RubyTuesdayDONO/5006455
function resolve(graph) {
    var sorted  = [], // sorted list of IDs ( returned value )
        visited = {}; // hash: id of already visited node => true

    // 2. topological sort
    Object.keys(graph).forEach(function visit(name, ancestors) {
        if (!Array.isArray(ancestors)) ancestors = [];
        ancestors.push(name);
        visited[name] = true;

        graph[name].forEach(function(dep) {
            if (ancestors.indexOf(dep) >= 0)  // if already in ancestors, a closed chain exists.
                throw new Error('Circular dependency "' +  dep + '" is required by "' + name + '": ' + ancestors.join(' -> '));

            // if already exists, do nothing
            if (visited[dep]) return;
            visit(dep, ancestors.slice(0)); // recursive call
        });

        if(sorted.indexOf(name)<0) sorted.push(name);
    });

    return sorted;
}

/**
 * Generate an object that represent dependencies in the following way:
 * var subscribers = {
    html: ['foo'],
    value: ['options', 'html'],
    foo: ['options'],
    bar: ['options', 'html'],
    options: [],
    css: ['value'],
    elements: ['css', 'html', 'options']
};
 */
function generateDependencyGraph(distroId, graph){
    var distroConfig = config.getDistro(distroId);
    graph[distroId] = distroConfig.dependencies || [];
    _.each(graph[distroId], function(dependency) {
        generateDependencyGraph(dependency, graph);
    });
}

function getMergedDistro(distroId) {
    var graph = {};
    generateDependencyGraph(distroId,graph);
    var dependenciesOrder = resolve(graph);
    var newDistro = {};

    _.each(dependenciesOrder, function(dependency,index) {
        utils.extend(true, newDistro, config.getDistro(dependency));
        if(index > 0){
            compileMergedDistroCommands(newDistro);
        }
    });

    dependenciesDistrosArray = dependenciesOrder;

    return utils.extend(true, {},newDistro);
}





function compileMergedDistroCommands(distro) {

    compileCommands(distro.modules, distro.modules);


    if(distro.tasksConfig) {
        distro.tasksConfig.javascript = distro.tasksConfig.javascript || [];
        if (distro.tasksConfig.javascript.length) {
            var groupedTasks = _.groupBy(distro.tasksConfig.javascript, function(j) {return j.entryPoint})
            distro.tasksConfig.javascript = _.map(groupedTasks, function (group, groupKey) {
                var newTaskEntryPoint = {};
                _.each(group, function(line,index) {
                    utils.extend(true,newTaskEntryPoint, line);

                });
                compileCommands(newTaskEntryPoint.dependencies,newTaskEntryPoint.dependencies);
                return newTaskEntryPoint;
            });
        }

        if (distro.tasksConfig &&
            distro.tasksConfig.sass &&
            distro.tasksConfig.sass.applications &&
            distro.tasksConfig.sass.applications.length) {
            var sass = distro.tasksConfig.sass;

            var groupedTasks = _.groupBy(sass.applications, function(j) {return j.name})
            sass.applications = _.map(groupedTasks, function (group, groupKey) {
                var newTaskEntryPoint = {};
                _.each(group, function(line,index) {
                    utils.extend(true,newTaskEntryPoint, line);

                });
                compileCommands(newTaskEntryPoint.dependencies,newTaskEntryPoint.dependencies);
                return newTaskEntryPoint;
            });
        }



        var sspLibraries = distro.tasksConfig['ssp-libraries'] || {};
        if (_.size(sspLibraries.dependencies)) {

            compileCommands(distro.tasksConfig['ssp-libraries'].dependencies,distro.tasksConfig['ssp-libraries'].dependencies);
        }

    }
}

function fixMergedDistro(distro) {
    if(distro.tasksConfig) {
        var javascripts = distro.tasksConfig.javascript || [];
        if (javascripts.length) {
            distro.tasksConfig.javascript = utils.smartReduce(javascripts, "entryPoint");
        }

        var sassApps = (distro.tasksConfig.sass && distro.tasksConfig.sass.applications) || [];
        if (sassApps.length) {
            distro.tasksConfig.sass.applications = utils.smartReduce(sassApps, "name");
        }
    }
}

function compile(distroId) {
    var distro = getMergedDistro(distroId);
    if(distro) {
        fixMergedDistro(distro);
    }
    return distro;
}


module.exports = {
    getDependenciesDistros: function() {
        return _.map(dependenciesDistrosArray,function(d){return config.getDestPathFromName(d)});
    },
    compile: compile
};