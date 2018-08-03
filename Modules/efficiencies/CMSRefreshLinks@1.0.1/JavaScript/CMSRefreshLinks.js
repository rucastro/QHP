// Add "data-cms-refresh" attribute to the desired DOM elements
define('CMSRefreshLinks', [
    'jQuery',
    'underscore'
], function CMSRefreshLinks(
    jQuery,
    _
) {
    'use strict';

    var Module = {

        refreshAttr: 'data-cms-refresh',

        refreshCmsAreas: function refreshLinks() {
            /* jshint -W117 */
            /* eslint-disable no-undef */
            if (typeof CMS !== 'undefined') {
                CMS.trigger('adapter:page:changed');
            }
            /* eslint-enable no-undef */
            /* jshint +W117 */
        },

        mountToApp: function mountToApp(application) {
            var layout = application.getLayout();

            layout.mouseDown.install({
                name: 'mouseUpRefreshCmsAreas',
                priority: 30,
                execute: function execute(e) {
                    _.defer(function deferCMS() {
                        if (jQuery('html').hasClass('ns_is-admin') &&
                            jQuery(e.currentTarget).is('[' + Module.refreshAttr + ']')) {
                            Module.refreshCmsAreas();
                        }
                    });
                }
            });
        }
    };

    return Module;
});
