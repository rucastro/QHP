/*
 © 2016 NetSuite Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
 */

define('ItemDetails.LookItems.ServiceController', [
    'ServiceController',
    'Application',
    'ItemDetails.Model.LookItems'
], function ItemDetailsModelLookItems(
    ServiceController,
    Application,
    ItemDetailsLookItemsModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'ItemDetails.LookItems.ServiceController',

        get: function methodGet() {
            var itemID = this.request.getParameter('itemID');
            if (itemID) {
                this.sendContent(
                    ItemDetailsLookItemsModel.getSameLookItem(itemID),
                    { 'cache': response.CACHE_DURATION_MEDIUM }
                );
            }
        }
    });
});
