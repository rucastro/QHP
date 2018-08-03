define('ItemDetails.View.GiftWrap', [
    'ProductDetails.Base.View',
    'ProductLine.Common.Url',
    'underscore',
    'jQuery',
    'Backbone.CollectionView',
    'ProductViews.Option.View',
    'GiftWrap.Configuration',
    'Utils'
], function ItemDetailsViewGiftWrap(
    View,
    ProductLineCommonUrl,
    _,
    jQuery,
    BackboneCollectionView,
    ItemViewsOptionView,
    GiftWrapConfig
) {
    'use strict';

    ProductLineCommonUrl.attributesReflectedInURL.push('gwm');

    _.extend(View.prototype, {
        initialize: _.wrap(View.prototype.initialize, function wrapInitialize(fn) {
            var self;
            var isGiftWrapModel = this.model.get('gwm');
            var hideDiv = [
                // Elbrus
                '.product-details-quickview-full-details',
                '.product-views-option-tile',
                '.product-views-option-checkbox',
                '.product-views-option-color',
                '.product-views-option-currency',
                '.product-views-option-date',
                '.product-views-option-datetimetz',
                '.product-views-option-dropdown',
                '.product-views-option-email',
                '.product-views-option-facets-color',
                '.product-views-option-facets-tile',
                '.product-views-option-float',
                '.product-views-option-integer',
                '.product-views-option-password',
                '.product-views-option-percent',
                '.product-views-option-phone',
                '.product-views-option-radio',
                '.product-views-option-text',
                '.product-views-option-textarea',
                '.product-views-option-tile',
                '.product-views-option-timeofday',
                '.product-views-option-url',
                '.product-views-price',
                '[data-view="Product.Stock.Info"]',
                '[data-view="Product.Sku"]',
                '[data-view="Product.Price"]',
                '[data-view="Quantity.Pricing"]',
                '[data-view="Quantity"]',
                '[data-view="AddToProductList"]',
                '[data-view="ProductDetails.AddToQuote"]',
                '[data-view="StockDescription"]',

                // Vinson
                '.quick-view-confirmation-modal-full-details',
                '.item-views-option-tile-picker',
                '.item-views-price-lead',
                '.quick-view-confirmation-modal-sku',
                '.quick-view-options-quantity',
                '.item-views-option-text',
                '.item-views-option-dropdown-gift-wrap h4',
                '.quick-view-confirmation-modal-add-to-product-list div',
                '[data-view="ItemDetails.AddToQuote"]'
            ];
            fn.apply(this, _.toArray(arguments).slice(1));

            this.on('afterViewRender', function afterViewRender() {
                if (this.application.getLayout().currentView &&
                    this.application.getLayout().currentView.model.id === 'cart' && this.inModal) {
                    self = this;

                    _.defer(function afterViewRenderDefer() {
                        if (isGiftWrapModel) {
                            jQuery(hideDiv).each(function each(index, value) {
                                jQuery(value).addClass('giftWrap-inactive');
                            });

                            jQuery('.product-details-quickview-item-name')
                                .html('Gifting Options: ' + self.model.get('item').get('_pageTitle'));
                        } else {
                            jQuery('.item-views-option-dropdown-gift-wrap').addClass('giftWrap-inactive');
                            jQuery('.item-views-option-gift-wrap-message').addClass('giftWrap-inactive');
                        }
                    });
                }
            });
        }),

        gwOptionChange: function gwOptionChange(e) {
            var val = (e.target.type === 'checkbox' && !jQuery(e.target).prop('checked')) ? '' : e.target.value;
            this.model.setOption('custcol_ef_gw_giftwrap', val).done(this.showContent.bind(this));
        }
    });

    View.prototype.events = ItemViewsOptionView.prototype.events || {};
    View.prototype.events['change [name="' + GiftWrapConfig.GiftWrapConfig.cartOptions.giftWrap + '"]'] = 'gwOptionChange';
});
