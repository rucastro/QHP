
define('LocalizationPatch.enAU', [
    'LocalizationPatch.Base',
    'underscore'
], function LocalizationPatchenAU(
    LocalizationPatchBase,
    _
) {
    'use strict';

    return _.defaults({
        localizationPatchLocale: 'enAU'
    }, LocalizationPatchBase);
});
