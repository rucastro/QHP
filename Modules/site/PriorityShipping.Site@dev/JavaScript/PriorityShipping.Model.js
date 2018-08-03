define('PriorityShipping.Model',[
    'Backbone',
    'underscore',
    'Utils'
], function PriorityShippingModel (
    Backbone,
    _,
    Utils
) {
    'use strict';

    return Backbone.Model.extend ({
        urlRoot: Utils.getAbsoluteUrl('services/PriorityShipping.Service.ss'),

        getCarrierName: function getCarrierName() {
            return this.get('carrier');
        },

        getShipmentCost: function getShipmentCost() {
            return this.get('cost');
        }

    });
});