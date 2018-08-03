define('ContactUsLandingPage.View', [
    'contact_us_landing_page.tpl',
    'jQuery',
    'Backbone',
    'underscore',
    'Utils',
    'SC.Configuration'
], function ContactUsLandingPageView(
    ContactUsLandingPageTpl,
    jQuery,
    Backbone,
    _,
    Utils,
    Configuration
) {
    'use strict';

    // @class ContactUsLandingPage.View @extends Backbone.View
    return Backbone.View.extend({

        template: ContactUsLandingPageTpl,
        title: Configuration.get('contactUsLandingPage.browsersTitle'),
        page_header: Configuration.get('contactUsLandingPage.pageHeading'),

        attributes: {
            'class': 'contact-us-landing-page'
        },

        getBreadcrumbPages: function getBreadcrumbPages() {
            return [{
                text: _(Configuration.get('contactUsLandingPage.pageHeading')).translate(),
                href: '/contact-us-page'
            }];
        },

        initialize: function initialize(options) {
            this.options = options;
            this.application = options.application;
        },

        getContext: function getContext() {
            // @class ContactUsLandingPage.View.Context
            return {
                // @property {String} url
                url: _.getAbsoluteUrl(),
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {{Array of Objects}} contactBlocks
                contactInfoBlocks: Configuration.get('contactUsLandingPage.contactInfoBlocks', []),
                // @property {{Array of Objects}} contactBlocks
                additonalContactInfoBlocks: Configuration.get('contactUsLandingPage.additonalContactInfoBlocks', [])
            };
        }
    });
});
