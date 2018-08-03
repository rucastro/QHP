define('Warehouse.Model',[
    'Backbone',
    'underscore',
    'Utils'
], function WarehouseModel (
    Backbone,
    _,
    Utils
) {
    'use strict';

    return Backbone.Model.extend ({
        urlRoot: Utils.getAbsoluteUrl('services/Warehouse.Service.ss'),

        getWarehouses: function() {
            return this.get('warehouses');
        },

        getName: function () {
            return this.get('name');
        },

        getId: function() {
            return this.get('id');
        },

        getItems: function () {
            return this.get('items');
        },

        getItemsRemoved: function() {
            return this.get('itemsRemoved');
        },

        getSelectedShippingMethod: function() {
            return this.get('shipMethod');
        },

        getSelectedShippingAddress: function() {
            return this.get('shipAddress');
        },

        isActive: function() {
            return this.get('active');
        },

        validateItemExistence: function(itemId) {
            var flagCount = 0;

            _.each(this.get('warehouses'), function eachWarehouse(warehouse) {
                _.each(warehouse.itemsAllocatedInWarehouse, function eachItem(item) {
                    if (item.itemId == itemId && item.isEligible) {
                        flagCount++;
                    }
                });
            });

            return (flagCount > 1) ? true : false;
        },


        validateItemStock: function(warehouseId, itemId) {
            var flagCount = 0;

            _.each(this.get('warehouses'), function eachWarehouse(warehouse) {

                if (warehouseId == warehouse.id) {
                    _.each(warehouse.itemsAllocatedInWarehouse, function eachItem(item) {
                        if (item.itemId == itemId && item.isEligible && item.quantityAvailable >= item.quantityOrder) {
                            flagCount++;
                        }
                    });
                }

            });

            return (flagCount > 0) ? true : false;
        }

    });
});