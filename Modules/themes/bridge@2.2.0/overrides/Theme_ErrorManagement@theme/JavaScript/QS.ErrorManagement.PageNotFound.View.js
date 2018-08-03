/*
    © 2017 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/

// @module ErrorManagementPageNotFound View
define('QS.ErrorManagement.PageNotFound.View', [
    'ErrorManagement.PageNotFound.View',
    'PluginContainer',
    'underscore',
    'SC.Configuration'
],
function QSErrorManagementPageNotFoundView(
    ErrorManagementPageNotFoundView,
    PluginContainer,
    _,
    Configuration
) {
    'use strict';

    return {

        mountToApp: function mountToApp() {
            ErrorManagementPageNotFoundView.prototype.installPlugin('postContext', {
                name: 'themeSummitContext',
                priority: 10,
                execute: function execute(context) {
                    _.extend(context, {
                        // @property {String} carouselBgrImg from QS.Home.View.js
                        captionBackgroundImg: _.getAbsoluteUrl(Configuration.get('home.carouselBgrImg')),
                        // @property {String} backgroundUrl
                        backgroundImage: _.getAbsoluteUrl(Configuration.get('errorManagementPageNotFound.pageNotFoundBgrImg')),
                        // @property {String} bkgdColor
                        backgroundColor: Configuration.get('errorManagementPageNotFound.bkgdColor'),
                        // @property {String} title
                        title: Configuration.get('errorManagementPageNotFound.title'),
                        // @property {String} text
                        text: Configuration.get('errorManagementPageNotFound.text'),
                        // @property {String} btnText
                        btnText: Configuration.get('errorManagementPageNotFound.btnText'),
                        // @property {String} btnHref
                        btnHref: Configuration.get('errorManagementPageNotFound.btnHref')
                    });
                }
            });
        }
    };
});
