/*
    © 2017 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/

// @module Home
define('QS.Home.View', [
    'Home.View',
    'PluginContainer',
    'underscore',
    'SC.Configuration'
],
function QSHomeView(
    HomeView,
    PluginContainer,
    _,
    Configuration
) {
    'use strict';

    _.extend(HomeView.prototype, {
        initialize: function ()
        {
            var self = this;
            this.windowWidth = jQuery(window).width();
            this.on('afterViewRender', function()
            {
                _.initBxSlider(self.$('[data-slider]'), {
                    nextText: '<a class="home-gallery-next-icon"></a>'
                    ,	prevText: '<a class="home-gallery-prev-icon"></a>'
                    ,	auto: true
                    ,   pause: 7000
                    ,   speed: 2000
                });
            });

            var windowResizeHandler = _.throttle(function ()
            {
                if (_.getDeviceType(this.windowWidth) === _.getDeviceType(jQuery(window).width()))
                {
                    return;
                }
                this.showContent();

                _.resetViewportWidth();

                this.windowWidth = jQuery(window).width();

            }, 1000);

            this._windowResizeHandler = _.bind(windowResizeHandler, this);

            jQuery(window).on('resize', this._windowResizeHandler);
        }
    });
    return {
        mountToApp: function mountToApp() {
            // for Carousel
            var carousel = _.map(Configuration.get('home.carouselImages', []), function mapCarouselImages(url) {
                return {
                    href: url.href,
                    image: _.getAbsoluteUrl(url.image),
                    linktext: url.linktext,
                    text: url.text,
                    title: url.title
                };
            });
            // for Infoblocks
            var infoblock = Configuration.get('home.infoblock', []);
            // for Free text and images
            var freeTextImages = Configuration.get('home.freeTextImages', []);

            HomeView.prototype.preRenderPlugins =
                HomeView.prototype.preRenderPlugins || new PluginContainer();

            HomeView.prototype.preRenderPlugins.install({
                name: 'themeSummitHome',
                execute: function execute($el /* , view */) {
                    $el.find('[data-view="FreeText"]')
                        .html(_(Configuration.get('home.freeText', '')).translate());
                }
            });

            HomeView.prototype.installPlugin('postContext', {
                name: 'themeSummitContext',
                priority: 10,
                execute: function execute(context, view) {
                    carousel = (view.model) ? view.model.get('carousel') : carousel;
                    _.extend(context, {
                        // @property {String} url
                        url: _.getAbsoluteUrl(),
                        // @property {Boolean} showCarousel
                        showCarousel: carousel && !!carousel.length,
                        // @property {Array<Object>} carousel
                        carousel: carousel,
                        // @property {String} carouselBgrImg
                        carouselBgrImg: _.getAbsoluteUrl(Configuration.get('home.carouselBgrImg')),
                        // @property {Array<Object>} infoblock
                        infoblock: infoblock,
                        // @property {String} freeTextTitle
                        freeTextTitle: _(Configuration.get('home.freeTextTitle')).translate(),
                        // @property {Boolean} showFreeTextImages
                        showFreeTextImages: !!freeTextImages.length,
                        // @property {Array<Object>} freeTextImages - the object contains the properties text:String, href:String
                        freeTextImages: freeTextImages
                    });
                }
            });
        }
    };
});
