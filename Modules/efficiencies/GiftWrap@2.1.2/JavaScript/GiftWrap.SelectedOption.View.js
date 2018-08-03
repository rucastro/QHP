define('GiftWrap.SelectedOption.View', [
    'Transaction.Line.Views.Options.Selected.View',
    'GiftWrap.Configuration',
    'bignumber',
    'underscore'
], function GiftWrapOptionView(
    ItemViewsSelectedOptionView,
    Configuration,
    bigNumber,
    _
) {
    'use strict';

    ItemViewsSelectedOptionView.prototype.installPlugin('postContext', {
        name: 'giftWrapSelectedContext',
        priority: 10,
        execute: function execute(context, view) {
            var line = view.model;
            var giftWrapItem;
            var amount;

            if (line.getOption(Configuration.GiftWrapConfig.cartOptions.giftWrap)) {
                giftWrapItem = line.get('giftwrap');

                if (giftWrapItem) {
                    amount = bigNumber(parseFloat(line.get('amount'))).plus(parseFloat(giftWrapItem.get('amount'))).toNumber();
                    line.set('amount_formatted', '$' + amount);
                    line.set('total_formatted', '$' + amount);

                    _.extend(context, {
                        giftWrapLine: {
                            total_formatted: giftWrapItem.get('total_formatted'),
                            isValid: giftWrapItem.get('amount') !== 0
                        }
                    });
                }
            }
        }
    });
});
