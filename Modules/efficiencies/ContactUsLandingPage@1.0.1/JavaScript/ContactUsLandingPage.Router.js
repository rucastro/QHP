define('ContactUsLandingPage.Router', [
    'ContactUsLandingPage.View',
    'Backbone',
    'underscore',
    'SC.Configuration'
], function ContactUsLandingPageRouter(
    View,
    Backbone,
    _,
    Configuration
) {
    'use strict';

    return Backbone.Router.extend({
        initialize: function initialize(application) {
            this.route(Configuration.get('contactUsLandingPage.pageUrl'), 'contactUsLandingPage');
            this.application = application;
        },

        contactUsLandingPage: function ContactUsLandingPage(options) {
            var view = new View({
                application: this.application,
                params: _.parseUrlOptions(options)
            });

            view.showContent();
        }
    });
});
