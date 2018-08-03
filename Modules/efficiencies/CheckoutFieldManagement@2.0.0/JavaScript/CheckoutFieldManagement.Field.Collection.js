
define('CheckoutFieldManagement.Field.Collection', [
    'CheckoutFieldManagement.Field.Model',
    'Backbone',
    'underscore',
    'Utils'
], function CheckoutFieldManagementFieldCollection(
    Model,
    Backbone,
    _
) {
    'use strict';

    return Backbone.Collection.extend({
        url: _.getAbsoluteUrl('services/CheckoutFieldManagement.Service.ss'),
        model: Model
    });
});
