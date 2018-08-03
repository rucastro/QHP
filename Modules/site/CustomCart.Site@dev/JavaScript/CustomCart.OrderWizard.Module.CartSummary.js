define('CustomCart.OrderWizard.Module.CartSummary', [
    'OrderWizard.Module.CartSummary',
    'LiveOrder.Model',
    'Profile.Model',
    'SC.Configuration',

    'underscore'
], function CustomCartOrderWizardModuleCartSummary (
    OrderWizardModuleCartSummary,
    LiveOrderModel,
    ProfileModel,
    Configuration,

    _
) {
    'use strict';

    _.extend(OrderWizardModuleCartSummary.prototype, {

        getLineItemFromWarehouseObject: function getLineItemFromWarehouseObject() {

            var lineItems = this.model.get('options').custbody_qhp_warehouse_obj;

            if (lineItems) {

                lineItems = JSON.parse(lineItems);

                //console.log('getLineItemFromWarehouseObject', lineItems);

                this.setDefaultDeliveryMethod();

                if (this.model.get('warehouses') && this.model.get('warehouses').length > 0) {

                    var warehouses = this.model.get('warehouses');

                    var locations = [];
                    _.each(warehouses.models, function eachWarehouse(warehouse) {

                        var warehouseId = warehouse.getId();
                        if (warehouse.isActive()) {
                            locations.push({id: warehouseId});
                        }
                    });

                    //console.log('model', this.model);

                    this.mapShippingCost(lineItems, locations);

                    this.render();
                }
            }
        },

        mapShippingCost: function mapShippingCost(lineItems, locations) {
            var totalShipping = 0, self = this;

            _.each(locations, function eachLocation(location) {
                var id = location.id;
                var shipCost = 0;

                _.each(lineItems, function eachLineItem(line) {

                    if (line.location == id && shipCost == 0) {
                        var shippingMethod = self.getShippingCostByShipMethod(line.shipMethod, id);
                        var cost = shippingMethod.rate;
                        shipCost = cost;
                        totalShipping = totalShipping + cost;
                    }

                });

            });



            if (typeof totalShipping == 'number') {
                var summary = this.model.get('summary');

                var total = summary.discountedsubtotal;
                total = parseFloat(total) + parseFloat(totalShipping);

                summary.shippingcost = totalShipping;
                summary.shippingcost_formatted = '$' + totalShipping.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

                summary.total = total;
                summary.total_formatted = '$' + total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

                this.model.set('summary', summary);
            }
        },

        getShippingCostByShipMethod: function getShippingCostByShipMethod(shipMethodId, warehouseId) {
            var shipMethods = this.model.get('shipmethods');
            var shipMethodObj = {};

            _.each(shipMethods.models, function eachShippingMethod(shipMethod) {
                if (shipMethod.get('internalid') == shipMethodId) {
                    shipMethodObj = {
                        internalid: shipMethod.get('internalid'),
                        name: shipMethod.get('name'),
                        rate: shipMethod.get('rate'),
                        rate_formatted: shipMethod.get('rate_formatted'),
                        shipcarrier: shipMethod.get('shipcarrier')
                    };
                }
            });

            if (Configuration.get('warehouse.enablePriorityShipping')) {
                var psShipMethods = this.model.get('psShipMethods');

                if (psShipMethods) {
                    _.each(psShipMethods, function eachShippingMethod(shipMethod) {
                        //console.log('shipMethod', shipMethod);

                        if (shipMethod.internalid == shipMethodId && shipMethod.warehouse == warehouseId) {
                            shipMethodObj = {
                                internalid: shipMethod.internalid,
                                name: shipMethod.name,
                                rate: shipMethod.rate,
                                rate_formatted: shipMethod.rate_formatted,
                                shipcarrier: shipMethod.shipcarrier
                            };
                        }
                    });
                }
            }

            //console.log('shipMethodObj', shipMethodObj);

            return shipMethodObj;
        },

        setDefaultDeliveryMethod: function () {
            var dummyShipMethod = Configuration.get('warehouse.shippingMethod');
            //console.log('setDefaultDeliveryMethod', dummyShipMethod);
            if (dummyShipMethod) {
                this.model.set('shipmethod', (dummyShipMethod).toString());    
                
            }
        },

        childViews: { }
    });

    OrderWizardModuleCartSummary.prototype._isReadFromConfirmation = function _isReadFromConfirmation() {
        var confirmation = this.wizard.model.get('confirmation');
        // You need to read from confirmation from the wizards (checkout) that have the isExternalCheckout and the return value is true (when returning from an external payment method)
        // Other wizards, like QuoteToSalesOrder, does not make the confirmation hack

        //console.log('confirmation', confirmation);

        var	read_from_confirmation = confirmation && (confirmation.internalid || confirmation.get('internalid')) && this.wizard.isExternalCheckout;
        //var	read_from_confirmation = confirmation && confirmation.internalid || confirmation.get('internalid')) && this.wizard.isExternalCheckout;

        return read_from_confirmation;
    };

    OrderWizardModuleCartSummary.prototype.getContext = function getContext () {
        var model = this._getModel();

        //console.log('OrderWizardModuleCartSummary - model', model);

        var	summary = model.summary || model.get('summary');
        var	item_count = 0;

        if (!model.confirmationnumber) {
            item_count = this.countItems(model.get('lines'));
        } else {
            item_count = model.lines.length;
        }

        var confirmation = this.wizard.model.get('confirmation');

        //console.log('item_count', item_count);

        return {
            model: model

            ,	itemCount: item_count

            ,	itemCountGreaterThan1: item_count > 1

            ,	giftCertificates: []

            ,	showGiftCertificates: false

            ,	showDiscount: !!summary.discounttotal

            ,	showHandlingCost: !!summary.handlingcost

            ,	showShippingCost: true

            ,	showPickupCost: false

            ,	showRemovePromocodeButton: !!this.options.allow_remove_promocode

            ,	showWarningMessage: !!this.options.warningMessage

            ,	warningMessage: this.options.warningMessage

            ,	showEditCartMST: this.wizard.isMultiShipTo() && !this.options.isConfirmation
        };

    };

    OrderWizardModuleCartSummary.prototype.initialize = _.wrap(OrderWizardModuleCartSummary.prototype.initialize, function initialize(fn) {
        fn.apply(this, _.toArray(arguments).slice(1));
        var self = this;

        //console.log('OrderWizardModuleCartSummary - Initialize');

        this.wizard.model.on('change:warehouses change:summary', function () {
            self.getLineItemFromWarehouseObject();
        });

    });

});