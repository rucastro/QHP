
define('LocalizationPatch', [
    'SC.Configuration',
    'underscore',
    'LocalizationPatch.enGB',
    'LocalizationPatch.enAU'
], function LocalizationPatch(
    Configuration,
    _
) {
    'use strict';

    var lpModuleArgs = _.toArray(arguments);

    return {
        mountToApp: function mountToApp(application) {
            var locale = Configuration.get('localizationPatch.locale');

            _.some(lpModuleArgs, function some(module) {
                if (locale && module.localizationPatchLocale === locale) {
                    module.loadModule({
                        hideTaxLine: application.getConfig('localizationPatch.hideTaxLine'),
                        hideHandlingLine: application.getConfig('localizationPatch.hideHandlingLine'),
                        useDatePicker: _.isNativeDatePickerSupported() === false || _.isDesktopDevice()
                    });
                    return true;
                }
                return false;
            });
        }
    };
});
