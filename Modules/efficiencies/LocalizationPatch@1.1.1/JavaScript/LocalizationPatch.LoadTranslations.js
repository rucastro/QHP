
// Hijacks SC.Configuration to ensure translations are loaded prior to any other modules, see distro

define('LocalizationPatch.LoadTranslations', [
    'SC.Configuration',
    'underscore'
], function LocalizationPatchLoadTranslations(
    Configuration,
    _
) {
    'use strict';

    var locale = Configuration.get('localizationPatch.locale');
    var translations = Configuration.get('localizationPatch.translations.' + locale);

    SC.Translations = SC.Translations || {};
    _.each(translations || {}, function addTranslations(translation) {
        SC.Translations[translation.base] = translation.translation;
    });

    /* Special translation hacks for cart summary view where template text uses '&amp;' instead of '&',
     * which breaks if the configuration is saved twice without changing '&' back to '&amp;'
     */
    if (SC.Translations['Estimate Tax & Shipping']) {
        SC.Translations['Estimate Tax &amp; Shipping'] = SC.Translations['Estimate Tax & Shipping'];
    }

    if (SC.Translations['View Cart & Checkout']) {
        SC.Translations['View Cart &amp; Checkout'] = SC.Translations['View Cart & Checkout'];
    }

    return Configuration;
});
