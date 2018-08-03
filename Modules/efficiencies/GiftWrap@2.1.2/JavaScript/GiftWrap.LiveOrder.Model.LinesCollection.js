define('GiftWrap.LiveOrder.Model.LinesCollection', [
    'Backbone',
    'LiveOrder.Model',
    'underscore'
], function GiftWrapLiveOrderModelLineCollection(
    Backbone,
    LiveOrderModel,
    _
) {
    'use strict';

    _.extend(LiveOrderModel.prototype, {
        initialize: _.wrap(LiveOrderModel.prototype.initialize, function initialize(fn) {
            fn.apply(this, _.toArray(arguments).slice(1));
            this.on('change:lines', this.wrapGiftWrapLines.bind(this));
        }),
        wrapGiftWrapLines: function wrapGiftWrapLines() {
            var lines = this.get('lines').models;
            var giftWrapsHashMap = {};
            var i;
            var line;
            var option;
            var options;
            var type;
            var key;

            for (i = 0; i < lines.length; i++) {
                line = lines[i];
                options = line.get('options');
                if ((!line.get('giftwrap')) && options.size() > 0) {
                    option = options.find(function find(opt) { return opt.get('cartOptionId') === 'custcol_ef_gw_id'; });
                    type = option && option.get('value') && option.get('value').internalid && option.get('value').internalid.substr(0, 2);
                    if (type) {
                        key = option.get('value').internalid.replace(type, '');
                        if (type === 'G:') {
                            giftWrapsHashMap[key] = giftWrapsHashMap[key] || {};
                            giftWrapsHashMap[key].giftwrap = i;
                        }
                        if (type === 'P:') {
                            giftWrapsHashMap[key] = giftWrapsHashMap[key] || {};
                            giftWrapsHashMap[key].parent = i;
                        }
                    }
                }
            }

            _.each(giftWrapsHashMap, function _giftWrapsHashMap(value, k) {
                if (value && !_.isUndefined(value.giftwrap) && !_.isUndefined(value.parent)) {
                    lines[value.parent].attributes.giftwrap = lines[value.giftwrap];
                    lines[value.giftwrap] = null;
                } else {
                    console.error( // eslint-disable-line no-console
                        'Error with giftwrap sync',
                        'Key:' + JSON.stringify(k) + ',Value:' + JSON.stringify(value)
                    );
                }
            });

            this.get('lines').models = _.compact(lines);
            this.get('lines').length = this.get('lines').models.length;

            return lines;
        }
    });
});
