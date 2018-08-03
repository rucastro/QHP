define('LookItem.Model', [
    'Item.Model',
    'Backbone',
    'Utils'
], function LookItemModel(
    ItemModel,
    Backbone,
    Utils
) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: Utils.getAbsoluteUrl('services/Look.Service.ss'),
        initialize: function initialize(data) {
            this.set('item', new ItemModel(data.item));
        }
    });
});
