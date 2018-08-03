/*
    © 2017 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/

// @module Footer
define('QS.Header.View', [
    'Header.View',
    'PluginContainer',
    'underscore',
    'SC.Configuration'
],
function QSHeaderView(
    HeaderView,
    PluginContainer,
    _,
    Configuration
) {
    'use strict';

    return {
        mountToApp: function mountToApp() {
            HeaderView.prototype.preRenderPlugins =
                HeaderView.prototype.preRenderPlugins || new PluginContainer();

            HeaderView.prototype.installPlugin('postContext', {
                name: 'themeBridgeContext',
                priority: 10,
                execute: function execute(context) {
                    _.extend(context, {
                        // @property {String} logobackground
                        logobackground: _.getAbsoluteUrl(Configuration.get('header.logoBackgroundImg')),
                        // @property {String} headerbackground
                        headerbackground: _.getAbsoluteUrl(Configuration.get('header.backgroundImg'))
                    });
                }
            });
        }
    };
});
