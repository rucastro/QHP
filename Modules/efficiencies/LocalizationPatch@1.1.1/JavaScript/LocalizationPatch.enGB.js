
define('LocalizationPatch.enGB', [
    'LocalizationPatch.Base',
    'underscore'
], function LocalizationPatchenGB(
    LocalizationPatchBase,
    _
) {
    'use strict';

    return _.defaults({
        localizationPatchLocale: 'enGB'
    }, LocalizationPatchBase);
});
