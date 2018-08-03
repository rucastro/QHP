define('HashScroll', [
    'SC.Configuration',
    'Backbone',
    'jQuery',
    'underscore'
], function HashScroll(
    Configuration,
    Backbone,
    jQuery,
    _
) {
    'use strict';

    /*
    * Extension to re-implement hash anchors in a SPA, as a query parameter
    * If you put ?target= (configurable here) as param, with a value, it perform a scroll to the matched html element:
    * The algorithm for lookup is:
    *   - First try to match by id
    *   - Then by name
    *   - Finally by class
    * If an element is found, then scroll to it.
    * */
    return {
        configuration: Configuration && Configuration.get('hashScroll'),

        mountToApp: function mountToApp(application) {
            var urlParam;
            var self = this;
            var target;

            application.getLayout().on('afterAppendView', function applicationGetLayout(view) {
                if (application.getLayout().currentView === view) {
                    urlParam = _.parseUrlOptions(Backbone.history.fragment)[self.configuration.urlparam];

                    if (urlParam) {
                        target = this.$('#' + urlParam);

                        if (!target.length) {
                            target = this.$('[name="' + urlParam + '"]');
                        }

                        if (!target.length) {
                            target = this.$('.' + urlParam).eq(0);
                        }

                        if (target.length) {
                            _.defer(function animateThis() {
                                var offset = target.offset().top;

                                if (self.configuration.animate) {
                                    jQuery('html, body').animate({ scrollTop: offset }, 500);
                                } else {
                                    jQuery('html, body').scrollTop(offset);
                                }
                            });
                        }
                    }
                }
            });
        }
    };
});
