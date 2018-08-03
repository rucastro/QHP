define('LookItem.Collection', [
    'LookItem.Model',
    'Backbone',
    'Utils'
], function LookItemCollection(
    Model,
    Backbone,
    Utils
) {
    'use strict';

    return Backbone.Collection.extend({
        url: Utils.getAbsoluteUrl('services/Look.Service.ss'),
        model: Model
    });
});
