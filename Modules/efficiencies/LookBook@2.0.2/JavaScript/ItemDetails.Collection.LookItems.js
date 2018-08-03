define('ItemDetails.Collection.LookItems', [
    'ItemDetails.Model.LookItems',
    'Backbone.CachedCollection',
    'Utils'
], function ItemDetailsCollectionLookItems(
    Model,
    BackboneCachedCollection,
    Utils
) {
    'use strict';

    return BackboneCachedCollection.extend({
        url: Utils.getAbsoluteUrl('services/ItemDetails.LookItems.Service.ss'),
        model: Model
    });
});
