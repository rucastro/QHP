/*
    © 2017 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/

// @module Footer
define('QS.Header.Simplified.View', [
    'Header.Simplified.View',
    'PluginContainer',
    'underscore',
    'SC.Configuration'
],
function QSHeaderSimplifiedView(
    HeaderSimplifiedView,
    PluginContainer,
    _,
    Configuration
) {
    'use strict';

    return {
        mountToApp: function mountToApp() {
            HeaderSimplifiedView.prototype.preRenderPlugins =
                HeaderSimplifiedView.prototype.preRenderPlugins || new PluginContainer();

            HeaderSimplifiedView.prototype.getContext = function getContext() {
                return {
                    // @property {String} logobackground
                    logobackground: _.getAbsoluteUrl(Configuration.get('header.logoBackgroundImg')),
                    // @property {String} headerbackground
                    headerbackground: _.getAbsoluteUrl(Configuration.get('header.backgroundImg'))
                };
            };
        }
    };
});
