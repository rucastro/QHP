define('OrderWizard.Module.Warehouse', [
    'Wizard.Module',
    'Warehouse.Collection',
    'Warehouse.Model',
    'Warehouse.View',

    'PriorityShipping.Model',

    'SC.Configuration',

    'LiveOrder.Model',
    'Profile.Model',
    'Backbone.CompositeView',
    'Backbone.CollectionView',
    'Transaction.Line.Views.Cell.Navigable.View',
    'Address.Details.View',
    'order_wizard_warehouse.tpl',
    'jQuery',
    'underscore'
], function OrderWizardModuleWarehouse(
    WizardModule,
    WarehouseCollection,
    WarehouseModel,
    WarehouseView,

    PriorityShippingModel,

    Configuration,

    LiveOrderModel,
    ProfileModel,
    BackboneCompositeView,
    BackboneCollectionView,
    TransactionLineViewsCellNavigableView,
    AddressDetailsView,
    orderWizardWarehouseTpl,
    jQuery,
    _
) {
    'use strict';

    return WizardModule.extend({

        template: orderWizardWarehouseTpl,

        readOnly: false,

        editUrl: null,

        moduleTitle: 'Warehouses',

        title: 'Warehouses',

        initialize: function initialize(options) {
            WizardModule.prototype.initialize.apply(this, arguments);

            this.wizard = options.wizard;
            this.step = options.step;
            this.model = options.wizard.model;
            this.options = options;

            var self = this;

            WizardModule.prototype.initialize.apply(this, arguments);
            this.wizard.model.on('ismultishiptoUpdated', function () {
                self.render();
            });

            this.wizard.model.on('promocodeUpdated', function () {
                self.render();
            });

            this.wizard.model.on('change:lines', function () {
                self.lines = self.wizard.model.getShippableLines();
                self.render();
            });

            this.lines = this.wizard.model.getShippableLines();

            BackboneCompositeView.add(this);

            this.options = this.options || {};

            this.options.exclude_on_skip_step = true;

            this.wizard.model.on('change:shipaddress', function () {
                self.initializeAddress();
            });

            this.initializeAddress(true);

            this.setDefaultDeliveryMethod();

            // this.reloadingMethods = true;
            //
            // this.warehouseCollection = new WarehouseCollection();
            // this.listenTo(this.warehouseCollection, 'sync', this.reloadMethod());
        },

        initializeAddress: function (no_render) {
            if (this.address) {
                this.address.off('change', null, null);
            }

            this.address = this.wizard.options.profile.get('addresses').get(this.wizard.model.get('shipaddress'));

            if (this.address) {
                this.address.on('change', this.render, this);
            }

            if (!no_render) {
                this.render();
            }
        },

        childViews: {
            'Warehouse.View': function warehouses() {
                var cart = LiveOrderModel.getInstance();
                var profile = ProfileModel.getInstance();
                var shippingAddress = '';
                var items = new Array();
                var lines = cart.get('lines').models;
                var self = this;
                var zip = '';

                var shipMethods = this.model.get('shipmethods');

                //console.log('lines', lines);
                //console.log('Checkout Model', this.model);

                if (this.model.get('warehouses') && this.model.get('warehouses').length > 0) {
                    this.warehouseCollection = new WarehouseCollection();

                    _.each(this.model.get('warehouses').models, function eachWarehouse(warehouse) {
                        self.warehouseCollection.add(warehouse);
                    });

                    return new WarehouseView({
                        collection: this.warehouseCollection,
                        title: this.options.title || _('Warehouses').translate(),
                        wizardModel: this.model
                    });
                }

                var shipAddress = this.model.get('shipaddress');

                if (shipAddress && profile.get('isLoggedIn') == 'T') {
                    var addressCollections = new Array();

                    addressCollections.push(profile.get('addresses'));
                    addressCollections.push(this.model.get('addresses'));
                    addressCollections.push(this.model.get('tempshipaddress'));

                    //console.log('shipAddress', shipAddress);
                    //console.log('addresses', profile.get('addresses'));

                    if (shipAddress && profile.get('addresses').length == 0) {
                        window.location.reload();
                    }


                    var address = profile.get('addresses').get(shipAddress);

                    var address1 = address.get('addr1');
                    var city = address.get('city');
                    var country = address.get('country');

                    var formattedAddress = address1 + ' ' + city + ' ' + country;

                    zip = address.get('zip');

                    //formattedAddress = formattedAddress.replace(/ /g,"+");

                    //console.log('address', address);

                    shippingAddress = formattedAddress;
                }

                if (lines && lines.length > 0 && profile.get('isLoggedIn') == 'T') {
                    var totalWeight = 0;
                    var weightEligibility = false;
                    _.each(lines, function(model) {
                        items.push({'quantity': model.get('quantity'),
                            'itemId': model.get('item').get('internalid')});

                        totalWeight = totalWeight + model.get('item').get('weight') * model.get('quantity');
                    });

                    totalWeight = totalWeight.toFixed(2);

                    this.warehouseCollection = new WarehouseCollection();
                    this.warehouseModel = new WarehouseModel();
                    this.warehouseModel.set('items', items);
                    this.warehouseModel.set('address', shippingAddress);

                    console.log('Priority Shipping Integration', Configuration.get('warehouse.enablePriorityShipping'));

                    if (Configuration.get('warehouse.enablePriorityShipping') && 
                        Configuration.get('warehouse.priorityShippingItem') && 
                        Configuration.get('warehouse.priorityShippingCarrier')) {
                        
                        var psShippingItem = Configuration.get('warehouse.priorityShippingItem');
                        var psShippingCarrier = Configuration.get('warehouse.priorityShippingCarrier');

                        var warehousePromise = self.warehouseModel.save();
                        
                        warehousePromise.then(function() {
                            console.log('Process Warehouses');
                            //console.log('warehouseModel', self.warehouseModel);
                            //console.log('lines', self.lines);

                            _.each(self.warehouseModel.getWarehouses(), function eachWarehouse(warehouse) {
                                var wModel = new WarehouseModel();
                                    wModel.set(warehouse);

                                var itemsAllocatedInWarehouse = wModel.get('itemsAllocatedInWarehouse');
                                var items = [];
                                var shippableLines = self.lines;

                                wModel.set('items', shippableLines);
                                wModel.set('active', true);

                                _.each(wModel.get('items'), function eachLines(lineModel) {
                                    var clonedLineModel = lineModel.clone();
                                    var itemInLine = lineModel.get('item');
                                    var item = _.findWhere(itemsAllocatedInWarehouse, {'itemId': itemInLine.get('internalid').toString()});
                                    var itemList = _.where(itemsAllocatedInWarehouse, {'itemId': itemInLine.get('internalid').toString()});
                                    //console.log('itemInLine', itemInLine);
                                    //console.log('itemsAllocatedInWarehouse', itemsAllocatedInWarehouse);
                                    //console.log('item', item);

                                        if (itemList && itemList.length > 0) {
                                            _.each(itemList, function eachItemInList(itemL, index) {

                                                //console.log('itemL', itemL);

                                                var clonedLineListModel = lineModel.clone();

                                                if (itemL && itemL.isEligible == true) {
                                                    var commitedQuantity = itemL.commitedQuantity;

                                                    if (commitedQuantity == -1) {
                                                        commitedQuantity = itemL.quantityOrder;
                                                    }
                                                    
                                                    var amount = commitedQuantity * clonedLineListModel.get('rate');
                                                        amount = amount.toFixed(2);
                                                    var amountFormatted = '$'+amount;

                                                    clonedLineListModel.set('itemId', itemL.itemId);
                                                    clonedLineListModel.set('warehouseId', wModel.get('id'));
                                                    clonedLineListModel.set('quantity', commitedQuantity);
                                                    clonedLineListModel.set('amount', amount);
                                                    clonedLineListModel.set('amount_formatted', amountFormatted);
                                                    clonedLineListModel.set('quantityOrder', itemL.quantityOrder);
                                                    clonedLineListModel.set('quantityCommitted', commitedQuantity);

                                                    var eligibleForShipOptions = self.warehouseModel.validateItemExistence(itemL.itemId) && self.warehouseModel.validateItemStock(wModel.get('id'), itemL.itemId);

                                                    //console.log('validate item stock', self.warehouseModel.validateItemStock(wModel.get('id'), item.itemId));

                                                    clonedLineListModel.set('shipOptions', eligibleForShipOptions);
                                                    clonedLineListModel.set('stockStatus', itemL.status);

                                                    clonedLineListModel.set('shipOptionsText', 'Ship complete from here');
                                                    clonedLineListModel.set('shipOptionsAction', 'ship-all-to-here');

                                                    var clonedLineListModelId = clonedLineListModel.id;

                                                    clonedLineListModel.id = clonedLineListModelId + '-' + index;
                                                        
                                                    //console.log('clonedLineListModel - ' + clonedLineListModel.id, clonedLineListModel);    
                                                    //self.warehouseModel.validateItemExistence(item.itemId));

                                                    items.push(clonedLineListModel);
                                                }
                                            });
                                        } else {
                                            if (item && item.isEligible == true) {
                                                var commitedQuantity = itemL.commitedQuantity;

                                                if (commitedQuantity == -1) {
                                                    commitedQuantity = itemL.quantityOrder;
                                                }

                                                var amount = commitedQuantity * clonedLineModel.get('rate');
                                                    amount = amount.toFixed(2);
                                                var amountFormatted = '$'+amount;

                                                clonedLineModel.set('itemId', item.itemId);
                                                clonedLineModel.set('warehouseId', wModel.get('id'));
                                                clonedLineModel.set('quantity', commitedQuantity);
                                                clonedLineModel.set('amount', amount);
                                                clonedLineModel.set('amount_formatted', amountFormatted);
                                                clonedLineModel.set('quantityOrder', item.quantityOrder);
                                                clonedLineModel.set('quantityCommitted', commitedQuantity);

                                                var eligibleForShipOptions = self.warehouseModel.validateItemExistence(item.itemId) && self.warehouseModel.validateItemStock(wModel.get('id'), item.itemId);

                                                //console.log('validate item stock', self.warehouseModel.validateItemStock(wModel.get('id'), item.itemId));

                                                clonedLineModel.set('shipOptions', eligibleForShipOptions);

                                                clonedLineModel.set('shipOptionsText', 'Ship complete from here');
                                                clonedLineModel.set('shipOptionsAction', 'ship-all-to-here');

                                                //self.warehouseModel.validateItemExistence(item.itemId));

                                                items.push(clonedLineModel);
                                            }
                                        }
                                });

                                //console.log('Warehouse ', wModel.getName());
                                //console.log('Warehouse Clone ', items);
                                wModel.set('shipAddress', shipAddress);
                                

                                wModel.set('psShippingItem', psShippingItem);
                                wModel.set('psShippingCarrier', psShippingCarrier);

                                wModel.set('items', items);

                                var weight = 0;
                                _.each(items, function(model) {
                                    if (model.get('item').get('weight')) {
                                        var individualWeight = model.get('item').get('weight') * model.get('quantity');
                                       weight = weight + individualWeight;
                                    } 
                                });

                                weight = weight.toFixed(2);

                                var threshold = Configuration.get('warehouse.priorityShippingWeightThreshold');
                                threshold = parseFloat(threshold);
                                console.log('Weight vs Threshold', 'Weight='+weight+' Threshold='+threshold);
                                if (weight > threshold) {
                                    weightEligibility = true;
                                    console.log('Weight is greather than Threshold');

                                    wModel.set('shipMethods', []);
                                    wModel.set('originZipCode', zip);
                                    wModel.set('totalWeight', totalWeight);

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
                                } else {
                                    wModel.set('shipMethods', shipMethods);
                                }

                                

                                console.log('Warehouse Model ' + wModel.getName() + '('+weight+')', wModel);
                                self.warehouseCollection.add(wModel);
                            });
                            //console.log('Warehouse Collection ', self.warehouseCollection);
                        });

                        warehousePromise.then(function() {
                            console.log('Set Warehouses in the Model');
                            self.model.set('warehouses', self.warehouseCollection);
                        });    
                    } else {
                        var warehousePromise = this.warehouseModel.save();
                        
                        warehousePromise.then(function() {
                            console.log('Process Warehouses');
                            //console.log('warehouseModel', self.warehouseModel);
                            //console.log('lines', self.lines);

                            _.each(self.warehouseModel.getWarehouses(), function eachWarehouse(warehouse) {
                                var wModel = new WarehouseModel();
                                    wModel.set(warehouse);

                                var itemsAllocatedInWarehouse = wModel.get('itemsAllocatedInWarehouse');
                                var items = [];
                                var shippableLines = self.lines;

                                wModel.set('items', shippableLines);
                                wModel.set('active', true);

                                _.each(wModel.get('items'), function eachLines(lineModel) {
                                    var clonedLineModel = lineModel.clone();
                                    var itemInLine = lineModel.get('item');
                                    var item = _.findWhere(itemsAllocatedInWarehouse, {'itemId': itemInLine.get('internalid').toString()});
                                    var itemList = _.where(itemsAllocatedInWarehouse, {'itemId': itemInLine.get('internalid').toString()});
                                    //console.log('itemList', itemList);

                                        if (itemList && itemList.length > 0) {
                                            _.each(itemList, function eachItemInList(itemL, index) {

                                                //console.log('itemL', itemL);

                                                var clonedLineListModel = lineModel.clone();

                                                if (itemL && itemL.isEligible == true) {
                                                    var amount = itemL.commitedQuantity * clonedLineListModel.get('rate');
                                                        amount = amount.toFixed(2);
                                                    var amountFormatted = '$'+amount;

                                                    clonedLineListModel.set('itemId', itemL.itemId);
                                                    clonedLineListModel.set('warehouseId', wModel.get('id'));
                                                    clonedLineListModel.set('quantity', itemL.commitedQuantity);
                                                    clonedLineListModel.set('amount', amount);
                                                    clonedLineListModel.set('amount_formatted', amountFormatted);
                                                    clonedLineListModel.set('quantityOrder', itemL.quantityOrder);
                                                    clonedLineListModel.set('quantityCommitted', itemL.commitedQuantity);

                                                    var eligibleForShipOptions = self.warehouseModel.validateItemExistence(itemL.itemId) && self.warehouseModel.validateItemStock(wModel.get('id'), itemL.itemId);

                                                    //console.log('validate item stock', self.warehouseModel.validateItemStock(wModel.get('id'), item.itemId));

                                                    clonedLineListModel.set('shipOptions', eligibleForShipOptions);
                                                    clonedLineListModel.set('stockStatus', itemL.status);

                                                    clonedLineListModel.set('shipOptionsText', 'Ship complete from here');
                                                    clonedLineListModel.set('shipOptionsAction', 'ship-all-to-here');

                                                    var clonedLineListModelId = clonedLineListModel.id;

                                                    clonedLineListModel.id = clonedLineListModelId + '-' + index;
                                                        
                                                    //console.log('clonedLineListModel - ' + clonedLineListModel.id, clonedLineListModel);    
                                                    //self.warehouseModel.validateItemExistence(item.itemId));

                                                    items.push(clonedLineListModel);
                                                }
                                            });
                                        } else {
                                            if (item && item.isEligible == true) {
                                                var amount = item.commitedQuantity * clonedLineModel.get('rate');
                                                    amount = amount.toFixed(2);
                                                var amountFormatted = '$'+amount;

                                                clonedLineModel.set('itemId', item.itemId);
                                                clonedLineModel.set('warehouseId', wModel.get('id'));
                                                clonedLineModel.set('quantity', item.commitedQuantity);
                                                clonedLineModel.set('amount', amount);
                                                clonedLineModel.set('amount_formatted', amountFormatted);
                                                clonedLineModel.set('quantityOrder', item.quantityOrder);
                                                clonedLineModel.set('quantityCommitted', item.commitedQuantity);

                                                var eligibleForShipOptions = self.warehouseModel.validateItemExistence(item.itemId) && self.warehouseModel.validateItemStock(wModel.get('id'), item.itemId);

                                                //console.log('validate item stock', self.warehouseModel.validateItemStock(wModel.get('id'), item.itemId));

                                                clonedLineModel.set('shipOptions', eligibleForShipOptions);

                                                clonedLineModel.set('shipOptionsText', 'Ship complete from here');
                                                clonedLineModel.set('shipOptionsAction', 'ship-all-to-here');

                                                //self.warehouseModel.validateItemExistence(item.itemId));

                                                items.push(clonedLineModel);
                                            }
                                        }
                                });

                                //console.log('Warehouse ', wModel.getName());
                                //console.log('Warehouse Clone ', items);
                                wModel.set('shipAddress', shipAddress);
                                wModel.set('shipMethods', shipMethods);
                                wModel.set('items', items);

                                console.log('Warehouse Model ' + wModel.getName(), wModel);
                                self.warehouseCollection.add(wModel);
                            });
                            //console.log('Warehouse Collection ', self.warehouseCollection);
                        });

                        warehousePromise.then(function() {
                            console.log('Set Warehouses in the Model');
                            self.model.set('warehouses', self.warehouseCollection);
                        });
                    }

                    console.log('Checkout Model', this.model);

                    return new WarehouseView({
                        collection: this.warehouseCollection,
                        title: this.options.title || _('Warehouses').translate(),
                        wizardModel: this.wizard.model
                    });
                }
            },

            'Items.Collection': function () {
                return new BackboneCollectionView({
                    collection: this.lines
                    ,	childView: TransactionLineViewsCellNavigableView
                    ,	viewsPerRow: 1
                    ,	childViewOptions: {
                        navigable: false

                        ,	detail1Title: _('Qty:').translate()
                        ,	detail1: 'quantity'

                        ,	detail2Title: _('Unit price:').translate()
                        ,	detail2: 'rate_formatted'

                        ,	detail3Title: _('Amount:').translate()
                        ,	detail3: 'amount_formatted'
                    }
                });
            },

            'Address.Details': function () {
                if (this.address)
                {
                    return new AddressDetailsView({
                        model: this.address
                        ,	hideActions: true
                        ,	hideDefaults: true
                    });
                }
            }
        },

        getFormattedDate: function() {
            var newDate = new Date();
            
            return (newDate.getMonth() + 1) + '/' + newDate.getDate() + '/' + newDate.getFullYear();
        },

        setDefaultDeliveryMethod: function () {
            var dummyShipMethod = Configuration.get('warehouse.shippingMethod');
            //console.log('setDefaultDeliveryMethod', dummyShipMethod);
            if (dummyShipMethod) {
                this.model.set('shipmethod', (dummyShipMethod).toString());    
                this.trigger('change:shipmethod', this.model);

                //console.log('Model', this.model);
            }

        },

        getContext: function() {
            return {
                title: this.options.title || _('Warehouses').translate(),
                isLoading: false,
                isLoaded: true,
                showEditCartButton: true,
                showAddress: !!this.address && this.options.hide_address !== true && !this.wizard.isMultiShipTo()
            };
        }
    });
});