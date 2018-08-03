define('SizeChart.Model', [
    'Backbone',
    'underscore',
    'Utils'
], function SizeChartModel(
    Backbone,
    _
) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: _.getAbsoluteUrl('services/SizeChart.Service.ss')
    });
});
