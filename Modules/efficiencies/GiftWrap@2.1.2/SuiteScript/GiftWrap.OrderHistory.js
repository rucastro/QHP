define('GiftWrap.OrderHistory', [
    'Application',
    'Utils',
    'OrderHistory.Model',
    'underscore'
], function PlacedOrderGiftWrap(
    Application,
    Utils,
    PlacedOrder,
    _
) {
    'use strict';

    _.extend(PlacedOrder, {
        /*
         We want to move the gift wrap lines so they are childs of the item lines
         In that way we can then show them everywhere as children instead
         of extra lines that don't make sense without their parents
         */
        rearrangeLinesForGiftWrap: function rearrangeLinesForGiftWrap() {
            var giftKeys = {};
            var offsets = 0;
            var giftWrapsHash = {};
            var i;
            var j;
            var line;
            var option;
            var key;
            var type;

            var lines = _.values(this.result.lines);
            var record = this.getTransactionRecord(this.recordType, this.recordId);

            // Find out for every item of the order, the transaction column field value
            for (j = 1; j <= record.getLineItemCount('item'); j++) {
                giftKeys[record.getLineItemValue('item', 'id', j)] = record.getLineItemValue(
                    'item',
                    'custcol_ef_gw_id',
                    j
                );
            }

            for (i = 0; i < lines.length; i++) {
                line = lines[i];
                if (line.options) {
                    option = giftKeys[line.internalid];
                    type = option && option.substr(0, 2);
                    if (type) {
                        key = option.replace(type, '');
                        if (type === 'G:') {
                            giftWrapsHash[key] = giftWrapsHash[key] || {};
                            giftWrapsHash[key].giftwrap = i;
                        }
                        if (type === 'P:') {
                            giftWrapsHash[key] = giftWrapsHash[key] || {};
                            giftWrapsHash[key].parent = i;
                        }
                    }
                }
            }

            // Move every giftWrap to its parent line and remove it from lines
            _.each(giftWrapsHash, function eachGiftWrapsHash(value, k) {
                if (value && !_.isUndefined(value.giftwrap) && !_.isUndefined(value.parent)) {
                    lines[value.parent - offsets].giftWrap = lines[value.giftwrap - offsets];
                    lines.splice(value.giftwrap - offsets, 1);

                    offsets++;
                } else {
/* eslint-disable */
                    console.error('GiftWrap', 'Error with:' + JSON.stringify(k) + ' ' + JSON.stringify(value));
/* eslint-enable */
                }
            });

            this.result.lines = lines;
        }
    });
});
