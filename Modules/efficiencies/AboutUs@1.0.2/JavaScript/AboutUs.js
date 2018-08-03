define('AboutUs', [
    'AboutUs.Router',
    'SC.Configuration'
], function AboutUs(
    Router,
    Configuration
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var config = Configuration.get('aboutUs', {});
            if (config.enabled) {
                return new Router(application);
            }

            return true;
        }
    };
});
