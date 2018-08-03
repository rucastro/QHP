define('AboutUs.Router', [
    'AboutUs.View',
    'Backbone',
    'underscore',
    'SC.Configuration'
], function AboutUsRouter(
    View,
    Backbone,
    _,
    Configuration
) {
    'use strict';

    return Backbone.Router.extend({
        routes: {},

        initialize: function initialize(application) {
            this.route(Configuration.get('aboutUs.pageUrl'), 'AboutUs');
            this.application = application;
        },

        AboutUs: function AboutUs(options) {
            var view = new View({
                application: this.application,
                params: _.parseUrlOptions(options)
            });

            view.showContent();
        }
    });
});
