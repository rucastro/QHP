define('GuestOrderStatus.Model', [
    'Backbone',
    'underscore',
    'Utils'
], function GuestOrderStatusModel(
    Backbone,
    _
) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: _.getAbsoluteUrl('services/GuestOrderStatus.Service.ss'),

        validation: {
            orderid: {
                required: true,
                msg: _('Order Id is required').translate()
            }
        },

        bindings: {
            '[name="orderid"]': 'orderid'
        },

        validateRequired: function validateRequired(value, attr, values) {
            return (!values.secondField || !values[values.secondField]);
        }
    });
});
