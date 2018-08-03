define('GuestOrderStatus.Details.View', [
    'Backbone',
    'guestorderstatus_details.tpl'
], function GuestOrderStatusDetailsView(
    Backbone,
    orderStatusDetailsTpl
) {
    'use strict';

    return Backbone.View.extend({
        template: orderStatusDetailsTpl,

        render: function render() {
            if (!this.model.isNew()) {
                this._render();
            }
            return this;
        },

        getContext: function getContext() {
            var details = [{
                name: 'Order #',
                value: this.model.get('orderid'),
                render: !!this.model.get('orderid')
            }, {
                name: 'Status',
                value: this.model.get('status'),
                render: !!this.model.get('status')
            }, {
                name: 'Item(s) for Shipping',
                value: this.model.get('shippingStatus'),
                render: !!this.model.get('shippingStatus')
            }, {
                name: 'Item(s) for Pickup',
                value: this.model.get('pickupStatus'),
                render: !!this.model.get('pickupStatus')
            }, {
                name: 'Tracking Numbers',
                value: this.model.get('trackingnumbers'),
                render: !!this.model.get('trackingnumbers')
            }, {
                name: 'Ship Method',
                value: this.model.get('shipmethod'),
                render: !!this.model.get('shipmethod')
            }, {
                name: 'Store',
                value: this.model.get('address'),
                render: !!this.model.get('address')
            }, {
                name: 'Opening Hours',
                value: this.model.get('openingHours'),
                render: !!this.model.get('openingHours')
            }];

            return {
                details: details
            };
        }
    });
});

