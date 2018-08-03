/*
 © 2016 NetSuite Inc.
 User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
 provided, however, if you are an authorized user with a NetSuite account or log-in, you
 may use this code subject to the terms that govern your access and use.
 */

// CheckoutFieldManagement.ServiceController.js
// ----------------
// Service to manage checkout field management requests
define('CheckoutFieldManagement.ServiceController', [
    'ServiceController',
    'CheckoutFieldManagement.Model'
], function CheckoutFieldManagementServiceController(
   ServiceController,
   CheckoutFieldManagementModel
) {
    'use strict';

    // @class CheckoutFieldManagement.ServiceController Manage checkout field management requests
    // @extend ServiceController
    return ServiceController.extend({

        // @property {String} name Mandatory for all ssp-libraries model
        name: 'CheckoutFieldManagement.ServiceController',

        // @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
        // The values in this object are the validation needed for the current service.
        // Can have values for all the request methods ('common' values) and specific for each one.
        options: {
            common: {
                requireLoggedInPPS: true
            },
            put: {
                requireLogin: false
            }
        },

        // @method get The call to CheckoutFieldManagement.Service.ss with http method 'get' is managed by this function
        // @return {CheckoutFieldManagement.Model.Item}
        get: function get() {
            return CheckoutFieldManagementModel.get();
        }
    });
});
