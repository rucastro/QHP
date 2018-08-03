/*
 © 2015 NetSuite Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
 */

define('LookBook.ServiceController', [
    'ServiceController',
    'Application',
    'LookBook.Model'
], function LookBookServiceController(
    ServiceController,
    Application,
    LookBookModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'LookBook.ServiceController',

        get: function get() {
            var urlComponent = this.request.getParameter('urlcomponent');
            if (urlComponent) {
                this.sendContent(
                    LookBookModel.getByUrlComponent(urlComponent),
                    { 'cache': response.CACHE_DURATION_MEDIUM }
                );
            } else {
                // if no urlcomponent, list the lookbooks
                // This isn't on our user stories, no need to implement it for now
                this.sendContent(
                    LookBookModel.list(),
                    { 'cache': response.CACHE_DURATION_MEDIUM }
                );
            }
        }
    });
});
