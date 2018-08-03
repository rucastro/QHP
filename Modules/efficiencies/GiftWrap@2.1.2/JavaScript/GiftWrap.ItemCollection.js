define('GiftWrap.ItemCollection', [
    'Item.Collection',
    'Session',
    'underscore',
    'Utils'
], function GiftWrapItemCollection(
    ItemCollection,
    Session,
    _,
    Utils
) {
    'use strict';

    /* This defines a collection of all gift wrap items */
    return ItemCollection.extend({
        url: function url() {
            return Utils.addParamsToUrl(
                '/api/items',
                // API URL NEEDS: searchApiMasterOptions, session params, order fieldset, and only gift wrap items
                _.extend({
                    fieldset: 'order',
                    custitem_ef_gw_is_giftwrap: true
                },
                this.searchApiMasterOptions,
                Session.getSearchApiParams()
                )
            );
        }
    });
});
