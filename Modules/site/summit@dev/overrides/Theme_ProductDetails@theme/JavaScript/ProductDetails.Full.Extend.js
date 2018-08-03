define('ProductDetails.Full.Extend', [
    'ProductDetails.Full.View',
    'underscore'
], function ProductDetailsFullView(
    ProductDetailsFullView,
    _
) {
    'use strict';

    _.extend(ProductDetailsFullView.prototype, {
       getContext: _.wrap(ProductDetailsFullView.prototype.getContext, function getContext(fn) {
            var itemModel = this.model.get('item')
            var content = fn.apply(this, _.toArray(arguments).slice(1));
            content.MSRP = itemModel.get('pricelevel19');
            content.MSRP_formatted = itemModel.get('pricelevel19_formatted');

            return content;
       })
    });
});
