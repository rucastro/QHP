/*
 © 2016 NetSuite Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
 */

define('Look.ServiceController', [
    'ServiceController',
    'Application',
    'Look.Model'
], function LookServiceController(
    ServiceController,
    Application,
    LookModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'Look.ServiceController',

        get: function methodGet() {
            var urlComponent = this.request.getParameter('urlcomponent');
            if (urlComponent) {
                this.sendContent(
                    LookModel.getByUrlComponent(urlComponent),
                    { 'cache': response.CACHE_DURATION_MEDIUM }
                );
            }
        }
    });
});
