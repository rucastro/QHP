define('InventoryDisplay.ItemViews.Stock.View', [
    'Backbone',
    'inventory_display_stock_views.tpl'
], function InventoryDisplayItemViewsStockView(
    Backbone,
    inventoryDisplayStockViewsTpl
) {
    'use strict';

    return Backbone.View.extend({
        template: inventoryDisplayStockViewsTpl,
        initialize: function initialize() {
            this.model.on('change', this.render, this);
        },
        getContext: function getContext() {
            var newMOdel;
            var originalModel = this.model;
            var childs = originalModel.getSelectedMatrixChilds();

            if (childs && childs.length === 1) {
                originalModel = childs[0];
                newMOdel = originalModel;
            } else {
                newMOdel = originalModel.get('item');
            }

            this.stock_info = newMOdel.getStockInfo();
            return {
                showOutOfStockMessage: !this.stock_info.showOutOfStockMessage,
                showInStockMessage: newMOdel.get('_showInStockMessageForPDP', true),
                inStockMessage: newMOdel.get('_inStockMessageForPDP', true),
                stockAvailable: newMOdel.get('quantityavailable')
            };
        }
    });
});
