define('Backbone.CompositeView.DataContext', [
    'underscore',
    'Backbone.View.render',
    'Backbone.View.PostContextHook'
], function BackboneCompositeViewDataContext(
    _,
    BackboneView
) {
    'use strict';

    var Module = {
        dataByPrefix: function dataByPrefix(dataObject, prefixString) {
            var regex = new RegExp('^' + prefixString + '[^a-z]');
            var found = false;
            var dataContext = {};
            if (prefixString in dataObject && _.isObject(dataObject[prefixString])) {
                dataContext = dataObject[prefixString];
            }
            _(dataObject).each(function each(value, key) {
                var newKey;
                if (regex.test(key)) {
                    found = true;
                    newKey = key.replace(prefixString, '');
                    dataContext[newKey.charAt(0).toLowerCase() + newKey.substring(1)] = value;
                }
            });
            return found ? dataContext : null;
        }
    };

    _(BackboneView.prototype).extend({
        getTemplateContext: _(BackboneView.prototype.getTemplateContext).wrap(function wrap(fn) {
            var view = this;
            var dataContext;
            var context;

            if (view.hasParent) {
                dataContext = Module.dataByPrefix(view.placeholderData, 'context');
                view.placeholderContextData = dataContext;
            }

            context = fn.apply(this, Array.prototype.slice.call(arguments, 1));

            if (_.isObject(dataContext)) {
                _.extend(context, dataContext);
            }

            return context;
        })
    });

    return Module;
});
