define('Warehouse.View', [
    'SC.Configuration',
    'Backbone',
    'warehouse_view.tpl',
    'Warehouse.Collection.View',
    'LiveOrder.Line.Collection',

    'PriorityShipping.Model',

    'Backbone.CollectionView',
    'Backbone.CompositeView',
    'jQuery',
    'underscore'

], function WarehouseView(
    Configuration,
    Backbone,
    warehouseViewTpl,
    WarehouseCollectionView,
    LiveOrderLineCollection,

    PriorityShippingModel,

    CollectionView,
    CompositeView,
    jQuery,
    _

){
    return Backbone.View.extend({

        initialize: function initialize() {
            CompositeView.add(this);
            //this.listenTo(this.collection, 'sync change add remove', this.render.bind(this));
            this.listenTo(this.collection, 'sync change add remove', this.render.bind(this));

            //this.on('afterViewRender', this.constructLineItems, this);
        },

        events: {
            'change [data-toggle="select-ship-method-option"]': 'setShipMethod',
            'click [data-action="ship-all-to-here"]': 'shipAllToHere',
            'click [data-action="distribute-shipping"]': 'distributeShipping'
        },

        shipAllToHere: function shipAllToHere(e) {
            var target = jQuery(e.currentTarget);
            var warehouseId = target.attr('warehouse-id');
            var itemId = target.attr('item-id');
            var self = this;

            this.collection.each(function eachWarehouse(warehouse) {
                console.log('warehouse', warehouse);
                var id = warehouse.getId();
                var items = warehouse.getItems();
                var indexToRemove = null;
                var chain = jQuery.when();

                // Set the total quantity order on one location
                chain.then(function() {
                    _.each(items, function eachItem(model, index) {
                        var item = model.get('item');

                        if (warehouseId == id && item.get('internalid') == itemId) {
                            var quantityOrder = model.get('quantityOrder');

                            var rate = model.get('rate');
                            var total = quantityOrder * rate;
                                total = total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

                            model.set('total', total);
                            model.set('total_formatted', '$'+total);

                            model.set('amount', total);
                            model.set('amount_formatted', '$'+total);

                            model.set('quantity', quantityOrder);
                            model.set('shipOptionsText', 'Distribute Shipping');
                            model.set('shipOptionsAction', 'distribute-shipping');

                            console.log('Warehouse to Use', warehouse);
                            
                            // If PS Integration is enabled update the Shipping Cost
                            if (warehouse.get('psShippingItem')) {
                                var currentPSCost = warehouse.get('psCost'); 
                                warehouse.set('distributedPSCost', currentPSCost); 

                                var priorityShippingModel = new PriorityShippingModel();
                                var promise = priorityShippingModel.fetch({
                                        async: false,
                                        data: {
                                            batchid: new Date(),
                                            originzip: warehouse.get('originZipCode'),
                                            destzip: warehouse.get('zipcode'),
                                            shipdate: self.getFormattedDate(),
                                            shipclass: 55,
                                            shipweight: warehouse.get('totalWeight')
                                        }
                                    });
                                    promise.done(function(){
                                        console.log('priorityShippingModel', priorityShippingModel);
                                        console.log('model', self.options.wizardModel);
                                        
                                        warehouse.set('psCost', parseFloat(priorityShippingModel.getShipmentCost()).toFixed(2));
                                        //warehouse.set('psCost', parseFloat('20.00').toFixed(2));

                                        var rate = priorityShippingModel.getShipmentCost();
                                        //var rate = 20;
                                        
                                        if (isNaN(rate)) {
                                            console.log('Rate is Not A Number');

                                            rate = parseFloat(rate).toFixed(2);
                                        }

                                        var psShipMethods = self.options.wizardModel.get('psShipMethods');
                                        _.each(psShipMethods, function eachPSShipMethods(psMethods) {
                                            if (psMethods.warehouse == id) {
                                                psMethods.rate = rate;
                                                psMethods.rate_formatted = '$'+rate;
                                            }
                                        }); 
                                    });
                            }
                        }

                        if (warehouseId != id && item.get('internalid') == itemId) {
                            indexToRemove = index;
                        }
                    });
                });

                // Set the removed item to removed items list
                chain.then(function() {
                    if (indexToRemove != null) {
                        var itemRemoved = items.splice(indexToRemove,1);
                        var itemsRemoved = warehouse.get('itemsRemoved');
                        if (!itemsRemoved) {

                            itemsRemoved = new Array();
                            itemsRemoved.push(itemRemoved);

                            warehouse.set('itemsRemoved', itemsRemoved);
                        } else {
                            itemsRemoved.push(itemRemoved);
                            warehouse.set('itemsRemoved', itemsRemoved);
                        }
                    }
                });

                // Validate warehouse if active (items > 0) or inactive (items == 0)
                chain.then(function() {
                    if (items.length == 0) {
                        warehouse.set('active', false);
                    } else {
                        warehouse.set('active', true);
                    }
                });
            });

            this.render();
        },

        getPSShippingCost: function getPSShippingCost() {
            var priorityShippingModel = new PriorityShippingModel();
            var promise = priorityShippingModel.fetch({
                    async: false,
                    data: {
                        batchid: new Date(),
                        originzip: zip,
                        destzip: wModel.get('zipcode'),
                        shipdate: self.getFormattedDate(),
                        shipclass: 55,
                        shipweight: weight
                    }
                });
                promise.done(function(){
                    //console.log('priorityShippingModel', priorityShippingModel);
                    
                    //wModel.set('psCarrier', priorityShippingModel.getCarrierName());

                    wModel.set('psCarrier', Configuration.get('warehouse.priorityShippingCarrierName') || 'LTL Standard Shipping');
                    wModel.set('psCost', parseFloat(priorityShippingModel.getShipmentCost()).toFixed(2));

                    var rate = priorityShippingModel.getShipmentCost();
                    
                    if (isNaN(rate)) {
                        console.log('Rate is Not A Number');

                        rate = parseFloat(rate).toFixed(2);
                    }

                    var psShippingMethod = {
                        warehouse: wModel.get('id'),
                        internalid: psShippingItem,
                        name: priorityShippingModel.getCarrierName(),
                        rate: rate,
                        rate_formatted: '$'+parseFloat(priorityShippingModel.getShipmentCost()).toFixed(2),
                        shipcarrier: psShippingCarrier
                        }

                        var psShipMethods = self.model.get('psShipMethods');   

                        if (psShipMethods) {
                        psShipMethods.push(psShippingMethod);
                        } else {
                        psShipMethods = [];
                        psShipMethods.push(psShippingMethod)
                        }
                        self.model.set('psShipMethods', psShipMethods); 
                });
        },

        distributeShipping: function distributeShipping(e) {
            var target = jQuery(e.currentTarget);
            var warehouseId = target.attr('warehouse-id');
            var itemId = target.attr('item-id');
            var self = this;

            this.collection.each(function eachWarehouse(warehouse) {
                var id = warehouse.getId();
                var items = warehouse.getItems();
                var itemsRemoved = warehouse.getItemsRemoved();
                var indexToRemove = null;
                var chain = jQuery.when();
                
                // Set back the quantity committed per warehouse
                chain.then(function() {
                    _.each(items, function eachItem(model) {
                        var item = model.get('item');

                        if (warehouseId == id && item.get('internalid') == itemId) {
                            var quantityCommitted = model.get('quantityCommitted');

                            var rate = model.get('rate');
                            var total = quantityCommitted * rate;
                            total = total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

                            //console.log('rate', rate);
                            //console.log('total', total);

                            model.set('total', total);
                            model.set('total_formatted', '$'+total);

                            model.set('amount', total);
                            model.set('amount_formatted', '$'+total);

                            model.set('quantity', quantityCommitted);
                            model.set('shipOptionsText', 'Ship complete from here');
                            model.set('shipOptionsAction', 'ship-all-to-here');

                            // If PS Integration is enabled distribute the Shipping Cost
                            if (warehouse.get('psShippingItem')) {
                                var currentPSCost = warehouse.get('distributedPSCost');
                                warehouse.set('psCost', currentPSCost);
                                var rate = currentPSCost;
                                        
                                if (isNaN(rate)) {
                                    console.log('Rate is Not A Number');

                                    rate = parseFloat(rate).toFixed(2);
                                }

                                var psShipMethods = self.options.wizardModel.get('psShipMethods');
                                _.each(psShipMethods, function eachPSShipMethods(psMethods) {
                                    if (psMethods.warehouse == id) {
                                        psMethods.rate = Number(rate);
                                        psMethods.rate_formatted = '$'+rate;
                                    }
                                }); 
                                //console.log('model', self.options.wizardModel);
                            }
                        }
                    });
                });

                // Set back the items removed
                chain.then(function() {
                    _.each(itemsRemoved, function eachItem(model, index) {
                        _.each(model, function eachModelInArray(modelA) {
                            //console.log('modelA', modelA);

                            var item = modelA.get('item');

                            console.log('item', item);

                            if (item.get('internalid') == itemId) {
                                items.push(modelA);

                                indexToRemove = index;
                                console.log('items', items);
                            }
                        });

                    });
                });

                // Remove the item on the items removed list
                chain.then(function() {
                    if (indexToRemove != null) {
                        itemsRemoved.splice(indexToRemove,1);
                    }
                });

                // Validate warehouse if active (items > 0) or inactive (items == 0)
                chain.then(function() {
                    if (items.length == 0) {
                        warehouse.set('active', false);
                    } else {
                        warehouse.set('active', true);
                    }

                    console.log('warehouse', warehouse);
                });
            });

            this.render();
        },

        setShipMethod: function setShipMethod(e) {
            var target = jQuery(e.currentTarget);
            var targetValue = target.val() || target.attr('data-value');
            var id = target.attr('warehouse-id');

            var chain = jQuery.when(), self = this;

            chain.then(function() {
                self.collection.each(function eachModel(model) {
                    var warehouseId = model.get('id');
                    if (warehouseId == id) {
                        model.set('shipMethod', targetValue);
                    }
                });
            });

            chain.then(function() {
                jQuery('.order-wizard-warehouse-module-parent').addClass('hide');
                jQuery('.order-wizard-warehouse-collection-container').removeClass('hide');

                self.constructLineItems();
            });

            //console.log('warehouses', self.collection);
        },

        constructLineItems: function constructLineItems() {
            // Item -- Location -- Quantity -- Shipping Method

            var lineItems = [], self = this;
            this.collection.each(function eachModel(warehouseModel) {
                var locationId = warehouseModel.getId();
                var shipMethod = warehouseModel.getSelectedShippingMethod();
                var shipAddress = warehouseModel.getSelectedShippingAddress();
                var carrier = self.getCarrierByShipMethodId(shipMethod);
                var cost = self.getShipCostByShipMethodId(shipMethod);
                var items = warehouseModel.getItems();
                var isPriorityShipping = (Configuration.get('warehouse.priorityShippingItem') && (Configuration.get('warehouse.priorityShippingItem') == shipMethod)) ? true : false;

                _.each(items, function eachItem(item) {
                    var quantity = item.get('quantity');
                    var itemId = item.get('item').id;
                    lineItems.push({item:itemId,
                                    location:locationId,
                                    quantity:quantity,
                                    shipMethod:shipMethod,
                                    shipAddress:shipAddress,
                                    shipCost:cost,
                                    carrier:carrier,
                                    priorityShipping:isPriorityShipping});
                });
            });

            if (lineItems.length > 0) {
                //console.log('custbody_qhp_warehouse_obj', JSON.stringify(lineItems));
                this.options.wizardModel.get('options').custbody_qhp_warehouse_obj  = JSON.stringify(lineItems);
                //this.mapShippingCost(lineItems);
                console.log('wizardModel', this.options.wizardModel);

                self.options.wizardModel.trigger('change:warehouses', self.options.wizardModel, {});

                this.setDefaultDeliveryMethod();
            }
        },

        setDefaultDeliveryMethod: function () {
            var dummyShipMethod = Configuration.get('warehouse.shippingMethod');
            console.log('Warehouse View - setDefaultDeliveryMethod', dummyShipMethod);
            if (dummyShipMethod) {
                this.options.wizardModel.set('shipmethod', (dummyShipMethod).toString());
            }
        },

        mapShippingCost: function mapShippingCost(lineItems) {
            console.log('lineItems', lineItems);
            var totalShipping = 0, self = this;
            _.each(lineItems, function eachLineItem(line) {
                var shippingMethod = self.getShippingCostByShipMethod(line.shipMethod);
                var cost = shippingMethod.rate;
                totalShipping = totalShipping + cost;
            });

            if (totalShipping && typeof totalShipping == 'number') {
                console.log('totalShipping', totalShipping);

                var summary = this.options.wizardModel.get('summary');

                var total = summary.total;
                    total = parseFloat(total) + parseFloat(totalShipping);

                summary.shippingcost = totalShipping;
                summary.shippingcost_formatted = '$' + totalShipping.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

                summary.total = total;
                summary.total_formatted = '$' + total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

                this.options.wizardModel.set('summary', summary);
            }
        },

        getShippingCostByShipMethod: function getShippingCostByShipMethod(shipMethodId) {
            var shipMethods = this.options.wizardModel.get('shipmethods');
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

            return shipMethodObj;
        },

        getShipCostByShipMethodId: function getShipCostByShipMethodId(id) {
            var shipMethods = this.options.wizardModel.get('shipmethods');
            var cost = '';

            _.each(shipMethods.models, function eachShipMethod(shipMethod) {
                if (shipMethod.get('internalid') == id) {
                    cost = shipMethod.get('rate');
                }
            });

            if (Configuration.get('warehouse.enablePriorityShipping') && cost.length == 0) {
                var psShipMethods = this.options.wizardModel.get('psShipMethods');

                if (psShipMethods) {
                    _.each(psShipMethods, function eachShippingMethod(shipMethod) {
                        //console.log('shipMethod', shipMethod);

                        if (shipMethod.internalid == id) {
                            cost = shipMethod.rate;
                        }
                    });
                }
            }

            return cost;
        },

        getCarrierByShipMethodId: function getCarrierByShipMethodId(id) {
            var shipMethods = this.options.wizardModel.get('shipmethods');
            var carrier = '';

            _.each(shipMethods.models, function eachShipMethod(shipMethod) {
                if (shipMethod.get('internalid') == id) {
                    carrier = shipMethod.get('shipcarrier');
                }
            });

            if (Configuration.get('warehouse.enablePriorityShipping') && carrier.length == 0) {
                var psShipMethods = this.options.wizardModel.get('psShipMethods');

                if (psShipMethods) {
                    _.each(psShipMethods, function eachShippingMethod(shipMethod) {
                        //console.log('shipMethod', shipMethod);

                        if (shipMethod.internalid == id) {
                            carrier = shipMethod.shipcarrier;
                        }
                    });
                }
            }

            return carrier;
        },

        getFormattedDate: function() {
            var newDate = new Date();
            
            return (newDate.getMonth() + 1) + '/' + newDate.getDate() + '/' + newDate.getFullYear();
        },

        childViews: {
            'Warehouse.Collection': function(){
                return new CollectionView({
                    'childView': WarehouseCollectionView,
                    'collection': this.collection,
                    'viewsPerRow': Infinity
                });
            }
        },

        getContext: function(){
            this.constructLineItems();

            return {
                title: this.options.title,
                hasWarehouses: (this.collection && this.collection.length > 0) ? true : false
            }
        },

        template: warehouseViewTpl
    });
});