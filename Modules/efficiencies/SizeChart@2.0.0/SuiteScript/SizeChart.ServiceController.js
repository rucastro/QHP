/*
 © 2016 NetSuite Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
 */

define('SizeChart.ServiceController', [
    'ServiceController',
    'Application',
    'SizeChart.Model'
], function SizeChartServiceController(
    ServiceController,
    Application,
    SizeChartModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'SizeChart.ServiceController',

        get: function getSizeChart() {
            var id = this.request.getParameter('internalid');
            var language = this.request.getParameter('lang');
            var content = SizeChartModel.get(id, language);

            this.sendContent(content, {
                'cache': content.volatility
            });
        }
    });
});
