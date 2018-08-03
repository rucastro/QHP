define('SC.MyAccount.Configuration.Site', [
    'underscore',
    'SC.MyAccount.Configuration',
    'SC.Configuration.Site'
], function SCMyAccountConfigurationSite(
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
