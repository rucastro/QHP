
define('GiftWrap.LiveOrder', [
    'Application',
    'Models.Init',
    'Utils',
    'LiveOrder.Model',
    'underscore'
], function LiveOrderGiftWrap(
    Application,
    CommerceAPI,
    Utils,
    LiveOrder,
    _
) {
    'use strict';

    var idGenerator = function idGenerator(qty) {
        return (Math.random().toString(36) + '00000000000000000').slice(2, qty + 2);
    };
    _.extend(LiveOrder, {
        tweakLinesGetGiftWrap: function tweakLinesGetGiftWrap(currentLine) {
            var generatedId;
            var generatedIdNL;
            var generatedIdOld;
            var giftItemId;
            var newLine;
            var giftWrapId;
            var newGiftWrapId;

            if (currentLine && currentLine.options) {
                giftItemId = _.findWhere(currentLine.options, { cartOptionId: 'custcol_ef_gw_giftwrap' });
                if (giftItemId && giftItemId.value) {
                    giftWrapId = _.findWhere(currentLine.options, { cartOptionId: 'custcol_ef_gw_id' });
                    newGiftWrapId = _.clone(giftWrapId);

                    generatedId = idGenerator(8);
                    generatedIdNL = String('G:' + generatedId).toString(); // HACKS for weird platform bugs with strings
                    generatedIdOld = String('P:' + generatedId).toString(); // HACKS for weird platform bugs


                    newGiftWrapId.value = {
                        internalid: generatedIdNL,
                        label: generatedIdNL
                    };
                    newLine = {
                        item: {
                            internalid: parseInt(giftItemId.value.internalid, 10)
                        },
                        quantity: currentLine.quantity,
                        options: [newGiftWrapId]
                    };

                    giftWrapId.value = {
                        internalid: generatedIdOld,
                        label: generatedIdOld
                    };
                    return newLine;
                }
            }
            return null;
        },
        giftWrapMST: function giftWrapMST() {
            var lines = CommerceAPI.order.getItems();
            var gwMap = {};

            _.each(lines, function eachItem(line) {
                var gwId;
                var gwKey;

                if (line && line.options && line.orderitemid) {
                    gwId = _.findWhere(line.options, { id: 'CUSTCOL_EF_GW_ID' });
                    if (gwId && gwId.value) {
                        gwKey = gwId.value.substr(2);
                        if (!gwMap[gwKey]) gwMap[gwKey] = {};
                        switch (gwId.value.substr(0, 2)) {
                        case 'G:':
                            gwMap[gwKey].wrap = line.orderitemid;
                            break;
                        case 'P:':
                            gwMap[gwKey].line = line.orderitemid;
                            break;
                        default:
                        }
                    }
                }
            });

            _.each(gwMap, function eachPair(pair) {
                var shipInfo = CommerceAPI.order.getItemShippingFieldValues(pair.line);
                CommerceAPI.order.setItemShippingAddress(pair.wrap, shipInfo.shipaddress);
                CommerceAPI.order.setItemShippingMethod(pair.wrap, shipInfo.shipmethod);
                CommerceAPI.order.setItemExcludedFromShipping(pair.wrap, true);
            });
        },
        addGiftWraps: function addGiftWraps(lines) {
            var currentLine;
            var giftWrapLine;

            if (_.isArray(lines) && lines.length === 1) { // Only 1 line add to cart support right now
                currentLine = lines[0];
                giftWrapLine = this.tweakLinesGetGiftWrap(currentLine);

                if (giftWrapLine) {
                    lines[1] = giftWrapLine;
                    Application.once('after:LiveOrder.addLines', function afterLiveOrderAddLines(Model, responseData) {
                        if (responseData) {
                            CommerceAPI.context.setSessionObject('latest_addition', responseData[0].orderitemid);
                        }
                    });
                }
            }
        },
        addGiftWrap: function addGiftWrap(currentLine) {
            var giftWrapLine = this.tweakLinesGetGiftWrap(currentLine);

            if (giftWrapLine) {
                Application.once('after:LiveOrder.addLine', function afterLiveOrderAddLine(Model, responseData) {
                    if (responseData) {
                        Model.addLine(giftWrapLine);
                        CommerceAPI.context.setSessionObject('latest_addition', responseData);
                    }
                });
            }
        },
        removeGiftWrap: function removeGiftWrap(currentLine) {
            var orderFieldKeys = [
                'orderitemid',
                'quantity',
                'internalid',
                'options'
            ];

            // Removing current line, we have to find the giftwrap
            var line = CommerceAPI.order.getItem(currentLine, orderFieldKeys);
            var optionGwId = _.findWhere(line.options, { id: 'CUSTCOL_EF_GW_ID' });
            var optionGw = _.findWhere(line.options, { id: 'CUSTCOL_EF_GW_GIFTWRAP' });

            var key;
            var lines;

            // If it has a giftwrap
            if (optionGwId && optionGw && optionGwId.value && optionGw.value) {
                // we have to search for the other line :(
                key = optionGwId.value.replace('P:', 'G:');
                lines = CommerceAPI.order.getItems(orderFieldKeys);

                // Why EVERY instead of each? Every will break on the first FALSE returned;
                // We need to iterate only until we get the gift wrap item
                _.every(lines, function every(l) {
                    var gwId = _.findWhere(l.options, { id: 'CUSTCOL_EF_GW_ID' });
                    // Found it? so after the removeLine, let's hang to it
                    if (gwId && gwId.value === key) {
                        Application.once(
                            'after:LiveOrder.removeLine',
                            function afterLiveOrderRemoveLine(Model) {
                                Model.removeLine(l.orderitemid);
                            }
                        );
                        return false;
                    }
                    return true;
                });
            }
        }
    });
});
