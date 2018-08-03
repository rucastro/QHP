define('InventoryDisplay.Model', [
    'Product.Model',
    'underscore'
], function defineInventoryDisplayModel(
    ProductModel,
    _
) {
    'use strict';

    var fields = [
        'internalid',
        'itemid',
        'itemtype',
        'quantityavailable',
        'isinstock',
        'isbackorderable',
        'ispurchasable',
        'isfulfillable',
        'showoutofstockmessage',
        'stockdescription',
        'isdropshipitem',
        'isspecialorderitem'
    ];

    var InventoryDisplayModel = ProductModel.extend({
        initialize: function initialize() {
            ProductModel.prototype.initialize.apply(this, arguments);

            InventoryDisplayModel.prototype.searchApiMasterOptions = _.omit(
                InventoryDisplayModel.prototype.searchApiMasterOptions,
                ['include', 'fieldset']
            );
            InventoryDisplayModel.prototype.searchApiMasterOptions.fields = fields.join(',');
        }
    });

    return InventoryDisplayModel;
});
