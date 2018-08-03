define('CustomAddress.GeoLocation.Model',[
    'Backbone',
    'underscore',
    'Utils'
], function CustomAddressGeoLocationModel (
    Backbone,
    _,
    Utils
) {
    'use strict';

    return Backbone.Model.extend ({
        urlRoot: Utils.getAbsoluteUrl('services/CustomAddress.Service.ss')
    });
});