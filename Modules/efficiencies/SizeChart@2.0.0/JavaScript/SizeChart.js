define('SizeChart', [
    'SizeChart.Router',
    'ItemSizeChartLink.View',
    'ProductDetails.Full.View',
    'SizeChart.Model',
    'PluginContainer'
], function SizeChart(
    Router,
    ItemSizeChartLink,
    ProductDetailsFullView,
    Model,
    PluginContainer
) {
    'use strict';


    return {
        mountToApp: function mountToApp(application) {
            ProductDetailsFullView.prototype.preRenderPlugins = ProductDetailsFullView.prototype.preRenderPlugins || new PluginContainer();

            ProductDetailsFullView.prototype.preRenderPlugins.install({
                name: 'ProductFormReviewsPreRenderPlugins',
                execute: function execute($el) {
                    $el
                        .find('[data-view="Product.Options"]')
                        .after('<div data-view="Item.SizeChart"/>');
                }
            });

            ProductDetailsFullView.addChildViews({
                'Item.SizeChart': function ItemSizeChart() {
                    var internalid = this.model.get('item').get('custitem_ef_sc_size_chart_id');
                    var sizeChartModel = new Model();
                    if (internalid) {
                        sizeChartModel.fetch({
                            data: {
                                internalid: internalid
                            }
                        });
                    }

                    return new ItemSizeChartLink({
                        model: this.model,
                        sizeChartModel: sizeChartModel
                    });
                }
            });

            return new Router(application);
        }
    };
});
