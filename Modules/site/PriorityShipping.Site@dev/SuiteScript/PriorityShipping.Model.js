define('PriorityShipping.Model',[
    'SC.Model',

    'underscore'
], function PriorityShippingModel (
    SCModel,

    _
) {
    'use strict';

    return SCModel.extend ({
        name: 'PriorityShipping',

        /** PriorityShipping **/

        priorityShippingSuitelet: {
            script: 'customscript_qhp_priority_shipping',
            deploy: 'customdeploy_qhp_priority_shipping'
        },

        getServiceUrl: function getServiceUrl() {
            var serviceUrl = nlapiResolveURL(
                'SUITELET',
                this.priorityShippingSuitelet.script,
                this.priorityShippingSuitelet.deploy,
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
                throw e.message;
            }

            return response;
        },

        searchWarehouses: function (data) {
            var serviceUrl = this.getServiceUrl(data, 'POST');

            if (data.items) {
                data.items = JSON.stringify(data.items);
            }

            return this.getServiceResponse(serviceUrl, data, 'POST');
        },

        get: function(batchid, originzip, destzip, shipdate, shipclass, shipweight) {

            var serviceUrl = this.getServiceUrl();

                serviceUrl += '&batchid=' + batchid;
                serviceUrl += '&originzip=' + originzip;
                serviceUrl += '&destzip=' + destzip;
                serviceUrl += '&shipdate=' + shipdate;
                serviceUrl += '&shipclass=' + shipclass;
                serviceUrl += '&shipweight=' + shipweight;

            return this.getServiceResponse(serviceUrl, null, 'GET');
        }



    });

});