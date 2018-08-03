define('GiftWrap.LiveOrder.Model', [
    'Backbone',
    'LiveOrder.Model',
    'underscore'
], function GiftWrapLiveOrderModel(
    Backbone,
    LiveOrderModel,
    _
) {
    'use strict';

    _.extend(LiveOrderModel.prototype, {
        unWrapGiftWrapLines: function unWrapGiftWrapLines(lines) {
            var giftWrapLine = {};
            lines.each(function eachLine(line) {
                if (line.get('giftwrap')) {
                    giftWrapLine = _.clone(line.get('giftwrap'));
                    giftWrapLine.deliverymethod = line.get('deliverymethod');
                    lines.add(giftWrapLine, { silent: true });

                    lines.at(lines.length - 1).set('item', line.get('giftwrap').get('item'));
                }
            });

            return lines;
        },

        toJSON: _.wrap(LiveOrderModel.prototype.toJSON, function wrappedToJSON(fn) {
            var originalReturn = fn.apply(this, _.toArray(arguments).slice(1));
            originalReturn.lines = this.unWrapGiftWrapLines(originalReturn.lines.clone());
            return originalReturn;
        })
    });
});
