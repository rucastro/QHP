define('QS.SC.Shopping.Layout', [
    'ApplicationSkeleton.Layout',
    'SC.Configuration',
    'underscore'
], function QSShoppingLayout(
    ApplicationSkeletonLayout,
    Configuration,
    _
) {
    'use strict';

    ApplicationSkeletonLayout.prototype.installPlugin('postContext', {
        name: 'themeHorizonContext',
        priority: 10,
        execute: function execute(context) {
            _.extend(context, {
                fixedHeader: Configuration.get('header.fixedHeader')
            });
        }
    });
});
