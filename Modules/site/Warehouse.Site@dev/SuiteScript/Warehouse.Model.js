define('Warehouse.Model',[
    'SC.Model',

    'underscore'
], function WarehouseModel (
    SCModel,

    _
) {
    'use strict';

    return SCModel.extend ({
        name: 'Warehouse',

        /** Warehouse **/

        warehouseSuitelet: {
            script: 'customscript_qhp_sl_warehouse',
            deploy: 'customdeploy_qhp_sl_warehouse'
        },

        getServiceUrl: function getServiceUrl() {
            var serviceUrl = nlapiResolveURL(
                'SUITELET',
                this.warehouseSuitelet.script,
                this.warehouseSuitelet.deploy,
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

        getEligibleWarehousePerItem: function getEligibleWarehousePerItem(requestType, address, itemId, quantity) {

            var serviceUrl = this.getServiceUrl();

            if (requestType && requestType == 'getEligibleWarehouse') {
                serviceUrl += '&requestType=' + requestType;
                serviceUrl += '&itemId=' + itemId;
                serviceUrl += '&address=' + address;
                serviceUrl += '&quantity=' + quantity;
            }
            return this.getServiceResponse(serviceUrl, null, 'GET');
        }

    });

});