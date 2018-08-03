define('ProductList.Lists.Extend', [
    'ProductList.Lists.View',
    'underscore'
], function ProductListListsExtend(
    ProductListListsView,
    _
) {
    'use strict';

    _.extend(ProductListListsView.prototype, {
        title: _('Product Lists').translate()
    });

    ProductListListsView.prototype.getBreadcrumbPages = function () {
        return {
            text: _('Product Lists').translate()
            ,	href: '/wishlist'
        };
    };
});
