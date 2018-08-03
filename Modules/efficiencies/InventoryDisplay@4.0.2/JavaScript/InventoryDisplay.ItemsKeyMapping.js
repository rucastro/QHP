define('InventoryDisplay.ItemsKeyMapping', [
    'Backbone',
    'SC.Configuration',
    'underscore'
], function InventoryDisplayItemsKeyMapping(
    Backbone,
    Configuration,
    _
) {
    'use strict';

    Configuration.itemKeyMapping = Configuration.itemKeyMapping || {};

    _.extend(Configuration.itemKeyMapping, {
        '_showInStockMessageForPDP': function _showInStockMessageForPDP(item) {
            var supportedItemTypes = SC.ENVIRONMENT.published.InventoryDisplay_DevConfig.supportedItemTypes;

            var model = item;
            return _.contains(supportedItemTypes, model.get('_itemType')) && !model.get('outofstockmessage');
        },
        '_inStockMessageForPDP': function _inStockMessageForPDP(item) {
            var model = item;
            if (model.get('isdropshipitem')) {
                return Configuration.inventoryDisplay.messageDropShip;
            } else if (model.get('isspecialorderitem')) {
                return Configuration.inventoryDisplay.messageSpecialOrder;
            } else if (model.get('_isBackorderable') && !model.get('_isInStock')) {
                return Configuration.inventoryDisplay.messageBackOrder;
            }

            return Configuration.inventoryDisplay.messageInStock;
        }
    });
});
