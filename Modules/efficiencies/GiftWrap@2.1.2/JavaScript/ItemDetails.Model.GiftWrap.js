define('ItemDetails.Model.GiftWrap', [
    'Item.Model',
    'GiftWrap.ItemCollection',
    'underscore',
    'jQuery'
], function ItemDetailsModelGiftWrap(
    ItemModel,
    GiftWrapCollection,
    _,
    jQuery
) {
    'use strict';

    _.extend(ItemModel.prototype, {
        initialize: _.wrap(ItemModel.prototype.initialize, function initialize(fn) {
            fn.apply(this, _.toArray(arguments).slice(1));
            this.giftWrapItems = new GiftWrapCollection();
        }),
        fetch: _.wrap(ItemModel.prototype.fetch, function fetch(fn, options) {
            var originalResponse = fn.apply(this, [options]);
            var giftWrapItemsResponse = this.giftWrapItems.fetch();
            var promise = jQuery.Deferred();
            var self = this;

            // Return a promise that is a combination of fetching the original item and the gift wrap collection
            jQuery.when(originalResponse, giftWrapItemsResponse).then(function then(data) {
                promise.resolveWith(self, [data[0]]);
            });

            return promise;
        })
    });
});
