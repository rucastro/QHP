/*
    © 2017 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/

// @module Footer
define('QS.GlobalViews.Breadcrumb.View', [
    'GlobalViews.Breadcrumb.View',
    'PluginContainer',
    'underscore'
],
function QSBreadcrumbView(
    BreadcrumbView,
    PluginContainer,
    _
) {
    'use strict';

    return {

        mountToApp: function mountToApp() {
            BreadcrumbView.prototype.preRenderPlugins =
                BreadcrumbView.prototype.preRenderPlugins || new PluginContainer();

            BreadcrumbView.prototype.preRenderPlugins.install({
                name: 'themeHorizonBreadcrumb',
                execute: function execute() {}
            });

            BreadcrumbView.prototype.installPlugin('postContext', {
                name: 'themeHorizonBreadcrumbContext',
                priority: 10,
                execute: function execute(context, view) {
                    var pages = view.pages;
                    var pageBanner;
                    var showCategHeading = false;
                    if (pages.length > 0) {
                        pageBanner = pages[pages.length - 1].pageBanner;
                        showCategHeading = (pages[pages.length - 1].isCategory) && (pages[pages.length - 1].pageBanner !== '');
                    }

                    _.extend(context, {
                        pageBanner: pageBanner,
                        showCategHeading: showCategHeading
                    });
                }
            });
        }
    };
});
