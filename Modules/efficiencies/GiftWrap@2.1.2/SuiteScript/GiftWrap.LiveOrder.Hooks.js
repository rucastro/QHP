define('GiftWrap.LiveOrder.Hooks', [
    'Application',
    'SiteSettings.Model',
    'underscore'
], function InStorePickupHooks(
    Application,
    SiteSettings,
    _
) {
    'use strict';

    if (SiteSettings.isMultiShippingRoutesEnabled()) {
        Application.on('before:LiveOrder.submit', function beforeLiveOrderSubmit(Model) {
            Model.giftWrapMST(Model);
        });
    }

    Application.on('before:LiveOrder.addLine',
        function beforeLiveOrderAddLineGiftWrap(Model, currentLine) {
            Model.addGiftWrap(currentLine);
        });

    Application.on('before:LiveOrder.addLines',
        function beforeLiveOrderAddLinesGiftWrap(Model, lines) {
            Model.addGiftWraps(lines);
        });

    Application.on('before:LiveOrder.removeLine',
        function beforeLiveOrderRemoveLine(Model, currentLine) {
            Model.removeGiftWrap(currentLine);
        });

    Application.on('before:LiveOrder.updateLine',
        function beforeLiveOrderUpdateLine(Model, lineid, line) {
            var giftWrap;
            var giftMsg;
            var giftId;
            if (line.options) {
                giftWrap = _.findWhere(line.options, { cartOptionId: 'custcol_ef_gw_giftwrap' });
                if (giftWrap && !giftWrap.value) {
                    giftMsg = _.findWhere(line.options, { cartOptionId: 'custcol_ef_gw_message' });
                    giftId = _.findWhere(line.options, { cartOptionId: 'custcol_ef_gw_id' });
                    if (giftMsg) delete giftMsg.value;
                    if (giftId) delete giftId.value;
                }
            }
        });
});
