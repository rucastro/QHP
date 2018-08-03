define('ItemDetails.LookItems', [
    'ItemDetails.View.LookItems',
    'ProductDetails.Full.View',
    'Backbone',
    'underscore',
    'Utils'
], function itemDetailsLookItems(
    ItemDetailsLookItems,
    ProductDetailsFullView,
    Backbone,
    _
) {
    'use strict';

    _.extend(ProductDetailsFullView.prototype.childViews, {
        'ProductDetails.LookItems': function ItemLookItems() {
            return new ItemDetailsLookItems({
                model: this.model.get('item'),
                application: this.application
            });
        }
    });

    return {
        mountToApp: function mountToApp() {
            ProductDetailsFullView.prototype.initialize = _.wrap(ProductDetailsFullView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.on('beforeCompositeViewRender', function afterViewRender() {
                    this.$el.find('[data-view="ProductReviews.Center"]').after('<div data-view="ProductDetails.LookItems"/>');
                });
            });
        }
    };
});
