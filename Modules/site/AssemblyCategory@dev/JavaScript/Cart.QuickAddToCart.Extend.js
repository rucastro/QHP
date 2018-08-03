define('Cart.QuickAddToCart.Extend', [
    'Cart.QuickAddToCart.View',
    'underscore'
], function CartQuickAddToCartExtend(
    CartQuickAddToCartView,
    _
) {
    'use strict';

    _.extend(CartQuickAddToCartView.prototype, {
        'initialize': _.wrap(CartQuickAddToCartView.prototype.initialize, function initialize(fn) {
            fn.apply(this, _.toArray(arguments).slice(1));
            this.showQuickAddToCartButton = this.options.isAssembly ? true : this.showQuickAddToCartButton;
        })
    });
});
