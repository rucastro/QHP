/*
    © 2017 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/

// @module Footer
define('QS.Footer.View', [
    'Footer.View',
    'PluginContainer',
    'underscore',
    'SC.Configuration',
    'jQuery'
],
function QSFooterView(
    FooterView,
    PluginContainer,
    _,
    Configuration,
    jQuery
) {
    'use strict';

    var getColLinks = function getColLinks(whichColumn) {
        // for large format footer with up to four columns of links
        var multiColLinks = Configuration.get('footer.multiColLinks', []);
        var targetColLinks = jQuery.grep(multiColLinks, function targetColLinks(e) {
            return e.column === whichColumn;
        });
        return targetColLinks;
    };

    return {
        mountToApp: function mountToApp() {
            // for Social Media Links
            var socialMediaLinks = Configuration.get('footer.socialMediaLinks', []);
            // for Copyright message
            var initialConfigYear = Configuration.get('footer.copyright.initialYear');
            var initialYear = initialConfigYear ? parseInt(initialConfigYear, 10) : new Date().getFullYear();
            var currentYear = new Date().getFullYear();

            FooterView.prototype.preRenderPlugins =
                FooterView.prototype.preRenderPlugins || new PluginContainer();

            FooterView.prototype.preRenderPlugins.install({
                name: 'themeBridgeFooter',
                execute: function execute($el /* , view */) {
                    $el.find('[data-view="PrimaryText"]')
                        .html(_(Configuration.get('footer.primaryText', '')).translate());
                    $el.find('[data-view="SecondaryText"]')
                        .html(_(Configuration.get('footer.secondaryText', '')).translate());
                }
            });

            FooterView.prototype.installPlugin('postContext', {
                name: 'themeBridgeContext',
                priority: 10,
                execute: function execute(context) {
                    _.extend(context, {
                        // @property {Array<Object>} col1Links
                        col1Links: getColLinks('Column 1'),
                        // @property {Array<Object>} col2Links
                        col2Links: getColLinks('Column 2'),
                        // @property {Array<Object>} col3Links
                        col3Links: getColLinks('Column 3'),
                        // @property {Array<Object>} col4Links
                        col4Links: getColLinks('Column 4'),
                        // @property {String} backgroundUrl
                        backgroundUrl: _.getAbsoluteUrl(Configuration.get('footer.backgroundImg')),
                        // @property {String} iconClass
                        iconClass: Configuration.get('footer.icon'),
                        // @property {String} title
                        title: Configuration.get('footer.title'),
                        // @property {Array<Object>} socialMediaLinks
                        socialMediaLinks: socialMediaLinks,
                        // @property {String} socialMediaLinksTitle
                        socialMediaLinksTitle: Configuration.get('footer.socialMediaLinksTitle'),
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
