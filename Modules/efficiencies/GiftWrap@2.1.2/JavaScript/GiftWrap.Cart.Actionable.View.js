define('GiftWrap.Cart.Actionable.View', [
    'Backbone',
    'item_view_cart_actionable.tpl',
    'underscore'
], function GiftWrapCartActionableView(
    Backbone,
    Template,
    _
) {
    'use strict';

    return Backbone.View.extend({
        template: Template,

        initialize: function initialize(options) {
            this.model = options.model;
            this.item = this.model.get('item');
            this.model.set({ hasGiftwrap: this.model.get('options').findWhere({ cartOptionId: 'custcol_ef_gw_id' }) });
        },

        getContext: function getContext() {
            return {
                hasGiftwrap: this.model.get('hasGiftwrap'),
                editUrl: _.addParamsToUrl(this.model.generateURL(), { 'source': 'cart', 'internalid': this.model.get('internalid') }),
                hideOption: this.model.get('type') || false
            };
        }
    });
});
