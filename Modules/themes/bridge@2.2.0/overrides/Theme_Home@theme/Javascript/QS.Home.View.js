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
], function QSHomeView(
    HomeView,
    PluginContainer,
    _,
    Configuration
) {
    'use strict';

    _(HomeView.prototype).extend({
        // add home-view class to layout container when in home
        initialize: _(HomeView.prototype.initialize).wrap(function wrap(fn) {
            var result = fn.apply(this, Array.prototype.slice.call(arguments, 1));

            this.once('afterViewRender', function homeViewAfterViewRender() {
                var application = this.options.application;
                var layout = application.getLayout().$el;
                var isHomeView = layout.hasClass('home-view');

                if (!isHomeView) {
                    layout.addClass('home-view');
                }
            });

            return result;
        }),
        // remove home-view class to layout container when leaving home
        destroy: _(HomeView.prototype.destroy).wrap(function wrap(fn) {
            var result = fn.apply(this, Array.prototype.slice.call(arguments, 1));
            var application = this.options.application;
            var layout = application.getLayout().$el;
            var isHomeView = layout.hasClass('home-view');

            if (isHomeView) {
                layout.removeClass('home-view');
            }

            return result;
        })
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

            // for Top Promo
            var topPromo = Configuration.get('home.topPromo', []);

            // for Infoblocks
            var infoblock = Configuration.get('home.infoblock', []);
            var infoblockTile = false;
            var infoblockFive = false;

            // for Free text and images
            var freeTextImages = Configuration.get('home.freeTextImages', []);

            // for Infoblocks
            if (infoblock.length === 3 || infoblock.length > 5) {
                infoblockTile = true;
            }
            if (infoblock.length === 5) {
                infoblockFive = true;
            }

            HomeView.prototype.preRenderPlugins =
                HomeView.prototype.preRenderPlugins || new PluginContainer();

            HomeView.prototype.preRenderPlugins.install({
                name: 'themeBridgeHome',
                execute: function execute($el /* , view */) {
                    // for Free text and images
                    $el.find('[data-view="FreeText"]')
                        .html(_(Configuration.get('home.freeText', '')).translate());
                }
            });

            HomeView.prototype.installPlugin('postContext', {
                name: 'themeBridgeContext',
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
                        // @property {Number} infoblockCount
                        infoblockCount: infoblock.length,
                        // @property {Boolean} infoblockTile
                        infoblockTile: infoblockTile,
                        // @property {Boolean} infoblockFive
                        infoblockFive: infoblockFive,
                        // @property {Array<Object>} freeTextImages
                        infoblock: infoblock,
                        // @property {String} freeTextTitle
                        freeTextTitle: _(Configuration.get('home.freeTextTitle')).translate(),
                        // @property {Boolean} showFreeTextImages
                        showFreeTextImages: !!freeTextImages.length,
                        // @property {Array<Object>} freeTextImages - the object contains the properties text:String, href:String
                        freeTextImages: freeTextImages,
                        // @property {Array<Object>} topPromo
                        topPromo: topPromo
                    });
                }
            });
        }
    };
});
