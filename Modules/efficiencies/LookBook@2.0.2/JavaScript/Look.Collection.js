define('Look.Collection', [
    'Look.Model',
    'Backbone'
], function LookCollection(
    Model,
    Backbone
) {
    'use strict';

    return Backbone.Collection.extend({
        model: Model
    });
});
