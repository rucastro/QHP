define('ItemSizeChartLink.View', [
    'Backbone',
    'item_size_chart_link.tpl',
    'jQuery',
    'underscore',
    'Utils'
], function ItemSizeChartLink(
    Backbone,
    itemSizeChartLinkTpl,
    jQuery,
    _
) {
    'use strict';

    return Backbone.View.extend({
        template: itemSizeChartLinkTpl,
        initialize: function initialize() {
            this.sizeChartModel = this.options.sizeChartModel;
            this.listenTo(this.sizeChartModel, 'change', jQuery.proxy(this.render, this));
        },
        getContext: function getContext() {
            return {
                internalid: this.model.get('item').get('custitem_ef_sc_size_chart_id'),
                name: this.model.get('item').get('custitem_ef_sc_size_chart'),
                linkText: _.translate(this.sizeChartModel.get('pdplink'))
            };
        }
    });
});
