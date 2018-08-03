define('GuestOrderStatus.Configuration', [
    'Configuration',
    'underscore'
], function GuestOrderStatusConfiguration(
    GlobalConfiguration,
    _
) {
    'use strict';

    var context = nlapiGetContext();

    var isBOPISEnabled = context.getSetting('FEATURE', 'storepickup') === 'T';

    var configuration = { isBOPISEnabled: isBOPISEnabled };

    if (isBOPISEnabled) {
        configuration.secondField = [{
            id: 'email',
            name: 'Email Address',
            validation: {
                pattern: 'email'
            }
        }];
    } else {
        configuration.secondField = [{
            id: 'shipzip',
            name: 'Shipping Address Zip Code'
        }, {
            id: 'email',
            name: 'Email Address',
            validation: {
                pattern: 'email'
            }
        }];
    }

    _.extend(configuration, {
        get: function get() {
            return this;
        }
    });

    if (!GlobalConfiguration.publish) {
        GlobalConfiguration.publish = [];
    }

    GlobalConfiguration.publish.push({
        key: 'GuestOrderStatus_DevConfig',
        model: 'GuestOrderStatus.Configuration',
        call: 'get'
    });

    return configuration;
});
