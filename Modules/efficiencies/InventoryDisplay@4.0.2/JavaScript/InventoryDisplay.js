define('InventoryDisplay', [
    'InventoryDisplay.ItemViews.Stock.View',
    'InventoryDisplay.Model',
    'InventoryDisplay.ItemsKeyMapping',
    'ProductDetails.Full.View',
    'PluginContainer',
    'SC.Configuration',
    'jQuery',
    'underscore'
], function InventoryDisplay(
    InventoryDisplayItemViewsStockView,
    InventoryDisplayModel,
    InventoryDisplayItemsKeyMapping,
    ProductDetailsFullView,
    PluginContainer,
    Configuration,
    jQuery,
    _
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var pdp = application.getComponent('PDP');
            var inventoryDisplay = Configuration.get('inventoryDisplay');
            if (inventoryDisplay.enabled) {
                application.Configuration.InventoryDisplay = Configuration.InventoryDisplay = // eslint-disable-line no-multi-assign
                    _.extend(Configuration.inventoryDisplay,
                    SC.ENVIRONMENT.published.InventoryDisplay_DevConfig);

                pdp.addChildViews('ProductDetails.Full.View', {
                    'Product.Stock.Info': {
                        'InventoryDisplay': {
                            childViewIndex: 1,
                            childViewConstructor: function childViewConstructor() {
                                return new InventoryDisplayItemViewsStockView({
                                    model: this.model
                                });
                            }
                        }
                    }
                });
            }
        }
    };
});
