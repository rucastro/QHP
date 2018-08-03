define('GiftWrap.Enablement', [
    'ProductDetails.Options.Selector.View',
    'SC.Configuration',
    'underscore'
], function GiftWrapEnablement(
    View,
    Configuration,
    _
) {
    'use strict';

    return {
        mountToApp: function mountToApp() {
            var giftWrapPricingEnabled = Configuration.get('quickStart.giftWrap');

            if (typeof giftWrapPricingEnabled === 'undefined' || !giftWrapPricingEnabled.enabled) {
                // remove giftwrap fields
                _.extend(View.prototype, {
                    render: _.wrap(View.prototype.render, function optionSelectorWrap(fn) {
                        fn.apply(this, _.toArray(arguments).slice(1));

                        this.$el.find('[data-cart-option-id="custcol_ef_gw_id"],' +
                                      '[data-cart-option-id="custcol_ef_gw_message"],' +
                                      '[data-cart-option-id="custcol_ef_gw_giftwrap"],' +
                                      '[data-cart-option-id="custcol_certificate_amount"]').remove();
                    })
                });
            }
        }
    };
});
