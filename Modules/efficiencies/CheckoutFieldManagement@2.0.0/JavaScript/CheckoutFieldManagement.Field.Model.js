
define('CheckoutFieldManagement.Field.Model', [
    'Backbone',
    'underscore',
    'Utils'
], function CheckoutFieldManagementFieldModel(
    Backbone,
    _
) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: _.getAbsoluteUrl('services/CheckoutFieldManagement.Service.ss')
    });
});
