define('GuestOrderStatus.Router', [
    'GuestOrderStatus.View',
    'Backbone'
], function GuestOrderStatusRouter(
    GuestOrderStatusView,
    Backbone
) {
    'use strict';

    return Backbone.Router.extend({
        routes: {
            'guestorderstatus': 'orderStatus'
        },

        initialize: function initialize(application) {
            this.application = application;
        },

        orderStatus: function orderStatus() {
            new GuestOrderStatusView({
                application: this.application
            }).showContent();
        }
    });
});
