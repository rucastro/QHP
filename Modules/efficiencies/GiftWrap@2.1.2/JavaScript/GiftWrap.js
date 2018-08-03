define('GiftWrap', [
    'GiftWrap.LiveOrder.Model',
    'GiftWrap.LiveOrder.Model.LinesCollection',
    'ItemDetails.Model.GiftWrap',
    'ItemDetails.View.GiftWrap',
    'GiftWrap.SelectedOption.View',
    'GiftWrap.Item.Options.View',
    'GiftWrap.Configuration',
    'GiftWrap.ItemCollection',
    'GiftWrap.OrderLineItemModel',
    'GiftWrap.Cart.View',

    'underscore',
    'SC.Configuration'
], function GiftWrap(
    GiftWrapLiveOrderModel,
    GiftWrapLiveOrderModelLinesCollection,
    ItemDetailsModelGiftWrap,
    ItemDetailsViewGiftWrap,
    GiftWrapSelectedOptionView,
    GiftWrapItemOptionView,
    GiftWrapConfiguration,
    ItemCollection,
    OrderLineItem,
    GiftWrapCartView,

    _,
    Configuration
) {
    'use strict';

    var giftWrapConfig = Configuration.get('quickStart.giftWrap');

    if (giftWrapConfig.enabled) {
        GiftWrapConfiguration.addGiftWrapOptions(Configuration.get('ItemOptions.optionsConfiguration') || []);

        Configuration.searchApiMasterOptions = GiftWrapConfiguration.addToSearchApiMasterOptions(
            Configuration.searchApiMasterOptions
        );

        _.extend(Configuration, { GiftWrapConfig: GiftWrapConfiguration.GiftWrapConfig });

        return {
            GiftWrapSelectedOptionView: GiftWrapSelectedOptionView,
            ItemDetailsModelGiftWrap: ItemDetailsModelGiftWrap,
            ItemDetailsViewGiftWrap: ItemDetailsViewGiftWrap,
            GiftWrapConfiguration: GiftWrapConfiguration,
            ItemCollection: ItemCollection,
            GiftWrapItemOptionView: GiftWrapItemOptionView
        };
    }
});
