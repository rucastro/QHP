define('InventoryDisplay.Configuration', [
    'Configuration',
    'underscore'
], function ModInventoryDisplayConfiguration(
    Configuration,
    _
) {
    'use strict';

    var InventoryDisplayConfiguration = {
        /*
         Only InventoryPart have Correct information about quantity available
         Kits have a weird calculation that seems buggy
         */
        supportedItemTypes: ['InvtPart']
    };

    _.extend(InventoryDisplayConfiguration, {
        get: function get() {
            return this;
        }
    });

    if (!Configuration.publish) {
        Configuration.publish = [];
    }

    Configuration.publish.push({
        key: 'InventoryDisplay_DevConfig',
        model: 'InventoryDisplay.Configuration',
        call: 'get'
    });

    return InventoryDisplayConfiguration;
});
