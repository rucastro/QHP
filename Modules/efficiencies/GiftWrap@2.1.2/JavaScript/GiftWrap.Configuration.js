define('GiftWrap.Configuration', [
    'underscore',
    'item_views_option_void.tpl',
    'item_views_option_gift_wrap_message.tpl',
    'transaction_line_views_selected_option.tpl',
    'item_views_selected_option_gift_wrap.tpl',
    'item_views_option_gift_wrap.tpl',
    'Item.KeyMapping'
], function GiftWrapConfiguration(
    _,
    itemViewsOptionVoidTpl,
    itemViewsOptionGiftWrapMessageTpl,
    itemViewsSelectedOptionTpl,
    itemViewsSelectedOptionGiftWrapTpl,
    itemViewsOptionGiftWrapTpl,
    ItemsKeyMapping
) {
    'use strict';

    var GiftWrapConfig = {
        cartOptions: {
            giftWrap: 'custcol_ef_gw_giftwrap',
            giftWrapId: 'custcol_ef_gw_id',
            giftWrapMessage: 'custcol_ef_gw_message'
        },
        itemFields: {
            isGiftWrap: 'custitem_ef_gw_is_giftwrap'
        }
    };

    ItemsKeyMapping.getKeyMapping = _.wrap(ItemsKeyMapping.getKeyMapping, function getKeyMapping(fn) {
        var keyMapping = fn.apply(this, _.toArray(arguments).slice(1));

        _.extend(keyMapping, {
            // For an item to be gift wrappable, it needs to have at least
            // one "gift wrap item" possible on the itemoption custcol_ef_gw_giftwrap
            _isGiftWrappable: function _isGiftWrappable(item) {
                var option = item.getOption(GiftWrapConfig.cartOptions.giftWrap);
                return option && option.get('values') && option.get('values').length > 1;
            },
            // Is it a gift wrap item? (Default:false)
            _isGiftWrap: GiftWrapConfig.itemFields.isGiftWrap
        });

        return keyMapping;
    });

    return {
        GiftWrapConfig: GiftWrapConfig,
        addToSearchApiMasterOptions: function addToSearchApiMasterOptions(apiOptions) {
            // For this you need to create the facet on the backend
            // First exclude giftwrap items
            // Then also exclude the facet from the response, it's not something that the user will filter by
            _.each(apiOptions, function eachApiOptions(value) {
                _.extend(value, {
                    'custitem_ef_gw_is_giftwrap': false,
                    'facet.exclude': value['facet.exclude'] ?
                        value['facet.exclude'] + ',' + GiftWrapConfig.itemFields.isGiftWrap :
                        GiftWrapConfig.itemFields.isGiftWrap
                });
            });

            return apiOptions;
        },

        addGiftWrapOptions: function addGiftWrapOptions(itemOptions) {
            _.each(itemOptions, function each(option) {
                if (_.contains(_.toArray(GiftWrapConfig.cartOptions), option.cartOptionId)) {
                    if (option.templateFacetCell) option.templates = _.extend(option.templates || {}, { facetCell: option.templateFacetCell });
                    if (option.templateSelected) option.templates = _.extend(option.templates || {}, { selected: option.templateSelected });
                    if (option.templateSelector) option.templates = _.extend(option.templates || {}, { selector: option.templateSelector });
                }
            });
        }
    };
});
