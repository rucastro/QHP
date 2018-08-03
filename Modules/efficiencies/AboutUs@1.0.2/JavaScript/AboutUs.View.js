define('AboutUs.View', [
    'about_us.tpl',
    'jQuery',
    'Backbone',
    'underscore',
    'Utils',
    'SC.Configuration'
], function AboutUsView(
    AboutUsTpl,
    jQuery,
    Backbone,
    _,
    Utils,
    Configuration
) {
    'use strict';

    // @class AboutUs.View @extends Backbone.View
    return Backbone.View.extend({

        template: AboutUsTpl,
        title: _(Configuration.get('aboutUs.browsersTitle')).translate(),
        page_header: _(Configuration.get('aboutUs.pageHeading')).translate(),

        attributes: {
            'class': 'about-us'
        },

        getBreadcrumbPages: function getBreadcrumbPages() {
            return [{
                text: _(Configuration.get('aboutUs.pageHeading')).translate(),
                href: '/about-us'
            }];
        },

        initialize: function initialize(options) {
            var layout;
            var self = this;

            this.options = options;
            this.application = options.application;

            layout = this.application.getLayout();
            layout.on('afterAppendView', function onAfterAppendView() {
                self.setMetaTagsByConfiguration();
            });
        },

        setMetaTagsByConfiguration: function setMetaTagsByConfiguration() {
            // jQuery('meta[name=description]').attr('content', 'new value');
            var content = Configuration.get('aboutUs.meta');

            jQuery('<meta />', {
                name: 'description',
                content: content
            }).appendTo(jQuery('head'));
        },

        getContext: function getContext() {
            // @class AboutUs.View.Context
            return {
                // @property {String} url
                url: _.getAbsoluteUrl(),
                // @property {String} pageHeader
                pageHeader: this.page_header,
                // @property {{String}} text
                aboutUsText: Configuration.get('aboutUs.text'),
                // @property {{Array of objects}} staff
                aboutUsStaff: Configuration.get('aboutUs.staff'),
                // @property {{Array of objects}} staff
                aboutUsBottomContent: Configuration.get('aboutUs.bottomContent')
            };
        }
    });
});
