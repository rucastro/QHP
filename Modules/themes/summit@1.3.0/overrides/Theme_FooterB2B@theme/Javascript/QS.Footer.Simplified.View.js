/*
    © 2017 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/

// @module Footer
define('QS.Footer.Simplified.View', [
    'Footer.Simplified.View',
    'PluginContainer',
    'underscore',
    'SC.Configuration'
],
function QSFooterSimplifiedView(
    FooterSimplifiedView,
    PluginContainer,
    _,
    Configuration
) {
    'use strict';

    return {
        mountToApp: function mountToApp() {
            // for Copyright message
            var initialConfigYear = Configuration.get('footer.copyright.initialYear');
            var initialYear = initialConfigYear ? parseInt(initialConfigYear, 10) : new Date().getFullYear();
            var currentYear = new Date().getFullYear();

            FooterSimplifiedView.prototype.preRenderPlugins =
                FooterSimplifiedView.prototype.preRenderPlugins || new PluginContainer();

            FooterSimplifiedView.prototype.preRenderPlugins.install({
                name: 'themeSummitFooter',
                execute: function execute() {}
            });

            FooterSimplifiedView.prototype.installPlugin('postContext', {
                name: 'themeSummitContext',
                priority: 10,
                execute: function execute(context) {
                    _.extend(context, {
                        copyright: {
                            hide: !!Configuration.get('footer.copyright.hide'),
                            companyName: Configuration.get('footer.copyright.companyName'),
                            initialYear: initialYear,
                            currentYear: currentYear,
                            showRange: initialYear < currentYear
                        }
                    });
                }
            });
        }
    };
});
