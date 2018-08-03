define('QuantityPricing.Enablement', [
    'SC.Configuration'
], function QuantityPricingEnablement(
    Configuration
) {
    'use strict';

    return {
        mountToApp: function mountToApp() {
            var quantityPricingEnabled = Configuration.get('quickStart.quantityPricing');

            if (!quantityPricingEnabled.enabled) {
                SC.ENVIRONMENT.siteSettings.quantitypricing = false;
            }
        }
    };
});
