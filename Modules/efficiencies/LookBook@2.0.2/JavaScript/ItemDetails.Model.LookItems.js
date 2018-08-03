define('ItemDetails.Model.LookItems', [
    'Backbone',
    'Item.Model',
    'Utils'
], function ItemDetailsModelLookItems(
    Backbone,
    ItemModel,
    Utils
) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: Utils.getAbsoluteUrl('services/ItemDetails.LookItems.Service.ss'),
        initialize: function initialize(data) {
            this.set('item', new ItemModel(data.item));
        }
    });
});
