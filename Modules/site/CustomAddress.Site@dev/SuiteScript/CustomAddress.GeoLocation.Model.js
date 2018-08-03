define('CustomAddress.GeoLocation.Model',[
    'SC.Model',

    'underscore'
], function CustomAddressGeoLocationModel (
    SCModel,

    _
) {
    'use strict';

    return SCModel.extend ({
        name: 'Geolocation',

        /** DeliveryOptions **/

        geoLocationSuitelet: {
            script: 'customscript_qhp_sl_geolocation',
            deploy: 'customdeploy_qhp_sl_geolocation'
        },

        getServiceUrl: function getServiceUrl() {
            var serviceUrl = nlapiResolveURL(
                'SUITELET',
                this.geoLocationSuitelet.script,
                this.geoLocationSuitelet.deploy,
                true
            );

            return serviceUrl;
        },

        getServiceResponse: function(serviceUrl, data, type) {
            var apiResponse;
            var response;

            try {
                switch (type) {
                    case 'GET':
                        apiResponse = nlapiRequestURL(serviceUrl, null, null, 'GET');
                        break;
                    case 'POST':
                        apiResponse = nlapiRequestURL(serviceUrl, data);
                        break;
                    case 'PUT':
                        apiResponse = nlapiRequestURL(serviceUrl, data);
                        break;
                    case 'DELETE':
                        apiResponse = nlapiRequestURL(serviceUrl, null, null, 'DELETE');
                        break;
                }
                response = apiResponse.getBody();
            } catch (e) {
                throw this.error.unknown;
            }

            return response;
        },

        getGeoLocationDetails: function getGeoLocationDetails(requestType, address, origin, destination, addressId, customerId) {

            var serviceUrl = this.getServiceUrl();

            if (requestType && requestType == 'getPoints') {
                serviceUrl += '&requestType=' + requestType;
                serviceUrl += '&address=' + address;

                if (addressId) {
                    serviceUrl += '&addressId=' + addressId;
                    serviceUrl += '&customerId=' + customerId;
                }
            }

            if (requestType && requestType == 'getDistance') {
                serviceUrl += '&requestType=' + requestType;
                serviceUrl += '&origin=' + origin;
                serviceUrl += '&destination=' + destination;
            }

            return this.getServiceResponse(serviceUrl, null, 'GET');
        }

    });

});