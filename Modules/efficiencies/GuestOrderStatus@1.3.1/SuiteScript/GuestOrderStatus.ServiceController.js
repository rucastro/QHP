define('GuestOrderStatus.ServiceController', [
    'ServiceController',
    'Application',
    'GuestOrderStatus.Model'
], function GuestOrderStatusServiceController(
    ServiceController,
    Application,
    GuestOrderStatusModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'GuestOrderStatus.ServiceController',

        post: function post() {
            var orderStatusData = GuestOrderStatusModel.get(this.data);
            this.sendContent(orderStatusData);
        }
    });
});
