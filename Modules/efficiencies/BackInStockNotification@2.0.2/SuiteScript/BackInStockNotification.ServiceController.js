define('BackInStockNotification.ServiceController', [
    'ServiceController',
    'Application',
    'BackInStockNotification'
], function BackInStockNotificationServiceController(
    ServiceController,
    Application,
    BackInStockNotificationModel
) {
    'use strict';

    // @extend ServiceController
    return ServiceController.extend({

        // @property {String} name
        name: 'BackInStockNotification.ServiceController',

        get: function methodGet() {
            var id = this.request.getParameter('internalid');
            if (id) {
                this.sendContent(BackInStockNotificationModel.get(id));
            } else {
                this.sendContent(BackInStockNotificationModel.list({
                    order: this.request.getParameter('order'),
                    sort: this.request.getParameter('sort'),
                    page: this.request.getParameter('page')
                }));
            }
        },
        post: function methodPost() {
            var resultId = BackInStockNotificationModel.post(this.data);
            this.sendContent(BackInStockNotificationModel.get(resultId, true));
        },
        'delete': function methodDelete() {
            var id = this.request.getParameter('internalid');
            BackInStockNotificationModel.delete(id);
            return { 'status': 'ok' };
        }
    });
});
