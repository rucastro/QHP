define('GiftWrap.Cart.View', [
    'Cart.Lines.View',
    'GiftWrap.Cart.Actionable.View',
    'underscore'
], function GiftWrapCartView(
    View,
    GiftWrapCartActionable,
    _
) {
    'use strict';

    _.extend(View.prototype, {
        initialize: _.wrap(View.prototype.initialize, function wrapInitialize(fn) {
            var item;
            fn.apply(this, _.toArray(arguments).slice(1));
            item = this.model.get('item');

            if (item.get('_isGiftWrappable')) {
                this.on('afterViewRender', function afterViewRender() {
                    this.$('[data-view="Item.Actions.View"]')
                        .append('<div class="cart-item-actions-item-list-actionable-edit-button giftwrap-action-item"' +
                                'data-view="GiftWrap.Item"></div>');
                    this.renderChild('GiftWrap.Item');
                });
            }
        }),
        childViews: _.extend(View.prototype.childViews || {}, {
            'GiftWrap.Item': function GiftWrapItem() {
                return new GiftWrapCartActionable({
                    application: this.application,
                    model: this.model
                });
            }
        })
    });
});
