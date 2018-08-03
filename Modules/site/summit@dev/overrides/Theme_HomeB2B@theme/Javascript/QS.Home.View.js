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
