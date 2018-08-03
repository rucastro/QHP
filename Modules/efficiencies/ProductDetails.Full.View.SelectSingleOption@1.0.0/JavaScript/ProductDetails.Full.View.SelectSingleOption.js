define('ProductDetails.Full.View.SelectSingleOption', [
    'ProductDetails.Full.View',
    'underscore'
], function ProductDetailsSelectSingleItemOption(
    View,
    _
) {
    'use strict';

    _.extend(View.prototype, {
        render: _.wrap(View.prototype.render, function itemDetailsWrap(fn) {
            var self = this;

            _.each(this.model.get('item').getPosibleOptions().models, function eachPossibleOption(opt) {
                var option;
                var valueCount;
                var firstValue;

                if (opt.get('type') === 'select' &&
                    opt.get('isMandatory') === true &&
                    opt.get('isMatrixDimension') === true &&
                    opt.get('values') && opt.get('values').length > 0
                ) {
                    option = self.model.getOption(opt.get('cartOptionId'));
                    if (option) {
                        valueCount = (typeof opt.get('values')[0].internalid !== 'undefined') ? 1 : 2;
                        if (opt.get('values').length === valueCount) {
                            firstValue = opt.get('values')[valueCount - 1];
                            if (typeof firstValue === 'object' && firstValue.isAvailable === true) {
                                try {
                                    self.model.setOption(opt.get('cartOptionId'), firstValue.internalid, false);
                                } catch (e) {
                                    // Clears all matrix options
                                    _.each(self.model.get('item').getPosibleOptions().models, function eachPossibleOptions(innerOpts) {
                                        if (innerOpts.get('isMatrixDimension')) {
                                            self.model.setOption(innerOpts.get('cartOptionId'), null);
                                        }
                                    });
                                    // Sets the value once again
                                    self.model.setOption(opt.cartOptionId, firstValue);
                                }
                            }
                        }
                    }
                }
            });
            fn.apply(this, _.toArray(arguments).slice(1));
        })
    });
});

