define('ContactUsLandingPage', [
    'ContactUsLandingPage.Router',
    'SC.Configuration'
], function ContactUs(
    Router,
    Configuration
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var config = Configuration.get('contactUsLandingPage', {});
            if (config.enabled) {
                return new Router(application);
            }

            return true;
        }
    };
});
