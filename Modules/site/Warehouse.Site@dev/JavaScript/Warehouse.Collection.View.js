define('Warehouse.Collection.View', [
    'SC.Configuration',
    'Backbone',
    'warehouse_collection_view.tpl',
    'Backbone.CollectionView',
    'Backbone.CompositeView',
    'Warehouse.Transaction.Line.Views.Cell.Navigable.View',
    'underscore',
    'jQuery',
    'Utils'
], function WarehouseCollectionView(
    Configuration,
    Backbone,
    warehouseCollectionViewTpl,
    CollectionView,
    CompositeView,
    TransactionLineViewsCellNavigableView,

    _,
    jQuery,
    Utils
){
    return Backbone.View.extend({

        initialize: function initialize() {
            CompositeView.add(this);
            //this.listenTo(this.model, 'change', this.render.bind(this));
        },

        childViews: {
            'Items.Collection': function () {

                return new CollectionView({
                    collection: this.model.get('items')
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
            }
        },

        getContext: function(){
            //console.log('Warehouse Model', this.model);
            var shipMethods = [], self = this;
            _.each(this.model.get('shipMethods').models, function eachShipMethod(shipMethod) {
                if (self.model.get('shipMethod') && shipMethod.get('internalid') == self.model.get('shipMethod')) {
                    shipMethods.push({selected: true,
                                        id: shipMethod.get('internalid'),
                                        name: shipMethod.get('name'),
                                        rateFormatted: shipMethod.get('rate_formatted'),
                                        carrier: shipMethod.get('shipcarrier')});
                } else {
                    shipMethods.push({id: shipMethod.get('internalid'),
                                        name: shipMethod.get('name'),
                                        rateFormatted: shipMethod.get('rate_formatted'),
                                        carrier: shipMethod.get('shipcarrier')});
                }
            });

            if (Configuration.get('warehouse.enablePriorityShipping')) {
                if (this.model.get('psCarrier')) {
                    //console.log('PS Carrier', this.model.get('psCarrier'));

                    if (this.model.get('shipMethod') && this.model.get('shipMethod') == this.model.get('psShippingItem')) {
                        shipMethods.push({selected: true,
                                        id: this.model.get('psShippingItem'),
                                        name: this.model.get('psCarrier'),
                                        rateFormatted: '$'+this.model.get('psCost'),
                                        carrier: this.model.get('psShippingCarrier')});
                    } else {
                        shipMethods.push({id: this.model.get('psShippingItem'),
                                        name: this.model.get('psCarrier'),
                                        rateFormatted: '$'+this.model.get('psCost'),
                                        carrier: this.model.get('psShippingCarrier')});    
                    }

                    
                }
            }

            if (!this.model.get('shipMethod') && shipMethods.length > 0) {
                var selectedMethod = shipMethods[0];
                this.model.set('shipMethod', selectedMethod.id);
            }
            return {
                name: this.model.getName(),
                warehouseId: this.model.getId(),
                shipMethods: shipMethods,
                active: this.model.isActive()
            }
        },

        template: warehouseCollectionViewTpl

    });
});