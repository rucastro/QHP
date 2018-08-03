define('SC.Checkout.Configuration.Site', [
    'underscore',
    'SC.Checkout.Configuration',
    'SC.Configuration.Site'
], function SCCheckoutConfigurationSite(
    _,
    ApplicationConfiguration,
    ConfigurationSite
) {
    'use strict';

    /**
     * DISCOURAGED: please use SC Configuration record and JSON files
     * In case you really need, you can still do it via code here
     */
    var ApplicationConfigurationSite = {
    };

    _(ApplicationConfiguration).extend(ConfigurationSite, ApplicationConfigurationSite);

    return {
        mountToApp: function mountToApp(application) {
            _.extend(application.Configuration, ApplicationConfiguration);
        }
    };
});
