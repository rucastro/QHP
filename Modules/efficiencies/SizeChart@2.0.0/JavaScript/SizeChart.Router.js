define('SizeChart.Router', [
    'Backbone',
    'SizeChart.Model',
    'SizeChart.View'
], function SizeChartRouter(
    Backbone,
    Model,
    SizeChartView
) {
    'use strict';

    return Backbone.Router.extend({
        routes: {
            'sizecharts/:internalid': 'sizechart'
        },

        initialize: function initialize(application) {
            this.application = application;
        },

        sizechart: function sizechart(id) {
            var model = new Model();
            var view = new SizeChartView({
                application: this.application,
                model: model
            });

            model.fetch({
                data: {
                    internalid: id
                }
            }).done(function done() {
                view.showContent();
            });
        }
    });
});
