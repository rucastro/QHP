define('StagingNoIndex', [
    'jQuery'
], function StagingNoIndex(
    jQuery
) {
    'use strict';

    /**
     * Module to prevent any site with our netsuitestaging domains to be indexed by google
     * Without having to care on robots.txt
     * which are re-writed with sandbox refreshes
     */
    return {//changed to ns-sca.com
        stagingDomain: '.ns-sca.com',

        mountToApp: function mountToApp() {
            var element = jQuery('meta[name="robots"]');
            if (location.hostname.indexOf(this.stagingDomain) !== -1) {
                if (element.length) {
                    element.attr('content', 'noindex, nofollow');
                } else {
                    jQuery('head').append('<meta name="robots" content="noindex, nofollow" />');
                }
            }
        }
    };
});
