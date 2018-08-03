define('Assembly.ItemCell.View', [
    'ProductLine.Stock.View',
    'Product.Model',
    'GlobalViews.StarRating.View',
    'Cart.QuickAddToCart.View',
    'ProductViews.Option.View',
    'ProductLine.StockDescription.View',
    'SC.Configuration',
    'Utils',
    'Backbone',
    'Backbone.CompositeView',
    'Backbone.CollectionView',
    'underscore'
], function AssemblyItemCellView(
    ProductLineStockView,
    ProductModel,
    GlobalViewsStarRating,
    CartQuickAddToCartView,
    ProductViewsOptionView,
    ProductLineStockDescriptionView,
    Configuration,
    Utils,
    Backbone,
    BackboneCompositeView,
    BackboneCollectionView,
    _
) {
    'use strict';

    return Backbone.View.extend({
        initialize: function initialize() {
            BackboneCompositeView.add(this);
        },
        childViews: {
            'Cart.QuickAddToCart': function () {
                var product = new ProductModel({
                    item: this.model,
                    quantity: this.model.get('_minimumQuantity', true)
                });

                return new CartQuickAddToCartView({
                    model: product,
                    application: this.options.application,
                    isAssembly: true
                });
            }
        },
        getContext: function () {

            var categoryID =  this.model.get('categoryID');
            var backgroundClass = '';
            var self = this;
            var showSeparator = false;
            var categoryIncluded = this.model.get('custitem_sca_showcategory');
            var noRedirect = !!this.model.get('custitem_ps_assemblycategorylink');
            categoryIncluded = categoryIncluded == '&nbsp;' ? '' : categoryIncluded;

            if (categoryIncluded) {
                categoryIncluded = categoryIncluded.split(',');

                var commerceCategory = this.model.get('commercecategory').categories;
                commerceCategory.forEach(function(category) {
                    categoryIncluded.forEach(function (categoryInc) {
                        if (category.name.trim() == categoryInc.trim()) {
                            self.commerceCategorySelected = category;
                        }
                    });
                });
                if (this.commerceCategorySelected.id == categoryID) showSeparator = true;
            }

            return {
                itemId: this.model.get('_id'),
                name: this.model.get('_name'),
                classCell: this.model.classDiff ? 'darCell': 'lighCell',
                backroundLineClass: backgroundClass,
                url: this.model.get('_url'),
                sku: this.model.getSku(),
                noRedirect: !noRedirect,
                imageIndex: this.model.get('itemCellID'),
                isAssemblyParent: this.model.get('custitem_sca_assemblyparent'),
                hasTableHeading: this.model.get('custitem_sca_assemblytableheading'),
                assemblyTitleHeading: this.model.get('custitem_sca_assemblytitle'),
                showAssemblyHeading: showSeparator,
                isEnvironmentBrowser: SC.ENVIRONMENT.jsEnvironment === 'browser' && !SC.ENVIRONMENT.isTouchEnabled,
                thumbnail: this.model.getThumbnail(),
                itemIsNavigable: !_.isUndefined(this.options.itemIsNavigable) ? !!this.options.itemIsNavigable : true,
                showRating: SC.ENVIRONMENT.REVIEWS_CONFIG && SC.ENVIRONMENT.REVIEWS_CONFIG.enabled,
                rating: this.model.get('_rating'),
                track_productlist_list: this.model.get('track_productlist_list'),
                track_productlist_position: this.model.get('track_productlist_position'),
                track_productlist_category: this.model.get('track_productlist_category')
            };
        }
    });
});
