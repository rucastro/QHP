define('QS.SC.MyAccount.Layout', [
    'ApplicationSkeleton.Layout',
    'SC.Configuration',
    'underscore'
], function QSMyAccountLayout(
    ApplicationSkeletonLayout,
    Configuration,
    _
) {
    'use strict';

    ApplicationSkeletonLayout.prototype.installPlugin('postContext', {
        name: 'themeSummitContext',
        priority: 10,
        execute: function execute(context) {
            _.extend(context, {
                fixedHeader: Configuration.get('header.fixedHeader')
            });
        }
    });
});
