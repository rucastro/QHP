/*
 © 2016 NetSuite Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
 */

define('ProductDetails.AddToQuote.Enablement', [
    'ProductDetails.Full.View',
    'underscore',
    'SC.Configuration'
], function ProductDetailsAddToQuoteEnablement(
    ProductDetailsFullView,
    _,
    Configuration
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var pdpToQuoteConfig = Configuration.get('quickStart.pdpAddToQuote');
            var pdp = application.getComponent('PDP');

            if (!pdpToQuoteConfig.enabled) {
                pdp.removeChildView('ProductDetails.Full.View', 'ProductDetails.AddToQuote');
            }
        }
    };
});
