define('GiftWrap.OrderLineItemModel', [
    'Transaction.Line.Views.Option.View'
], function OrderLineModelGiftWrap(
    TransactionLineViewsOptionView
) {
    'use strict';

    TransactionLineViewsOptionView.prototype.installPlugin('postContext', {
        name: 'giftWrapOptionContext',
        priority: 10,
        execute: function execute(context, view) {
            var giftWrap;
            if (context.cartOptionId === 'custcol_ef_gw_giftwrap') {
                giftWrap = view.line_model.get('giftwrap');
                if (giftWrap) context.selectedValue.label = giftWrap.get('item').get('_name') + ' ' + giftWrap.getPrice().price_formatted;
            }
        }
    });
});
