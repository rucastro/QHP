define('LookItem.View', [
    'Backbone',
    'ProductViews.Price.View',
    'ProductLine.Stock.View',
    'Backbone.CompositeView',
    'look_item.tpl'
], function LookItemView(
    Backbone,
    ProductViewsPriceView,
    ProductLineStockView,
    BackboneCompositeView,
    lookItemTpl
) {
    'use strict';

    return Backbone.View.extend({
        template: lookItemTpl,
        initialize: function initialize() {
            BackboneCompositeView.add(this);
        },

        childViews: {
            'ItemViews.Price': function ItemPrice() {
                return new ProductViewsPriceView({ model: this.model.get('item') });
            },
            'ItemViews.Stock': function ItemStock() {
                return new ProductLineStockView({ model: this.model.get('item') });
            }
        },

        getContext: function getContext() {
            return {
                // look item fields
                name: this.model.get('name'),
                description: this.model.get('description'),
                link: this.model.get('link'),
                imageId: this.model.get('imageid'),
                image: this.model.get('image'),
                // product/item fields
                itemname: this.model.get('item').get('_name'), // see ItemsKeyMapping.js for property _name
                itemId: this.model.get('item').get('_id'),
                url: this.model.get('item').get('_url'),
                thumbnail: this.model.get('item').get('_thumbnail'),
                isEnvironmentBrowser: SC.ENVIRONMENT.jsEnvironment === 'browser' && !SC.ENVIRONMENT.isTouchEnabled
            };
        }
    });
});
