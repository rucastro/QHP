define('SC.Shopping.Configuration.Site', [
    'underscore',
    'SC.Shopping.Configuration',
    'SC.Configuration.Site'
], function SCShoppingConfigurationSite(
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
            if (SC.isPageGenerator()) {
                application.Configuration.searchApiMasterOptions.Facets['facet.exclude'] = 'custitem_type,custitem_facet_size';
            }
        }
    };
});
