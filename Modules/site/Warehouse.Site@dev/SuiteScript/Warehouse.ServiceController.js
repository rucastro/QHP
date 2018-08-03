define('Warehouse.ServiceController',	[
	'ServiceController',
	'Application',
	'Warehouse.Model'
], function WarehouseServiceController(
	ServiceController,
	Application,
    WarehouseModel
) {
		'use strict';

		// @class Warehouse.ServiceController Manage warehouse requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name:'Warehouse.ServiceController',
			
			get: function get() {

				var requestType = this.request.getParameter('requestType');
                var address = this.request.getParameter('address');
                var itemId = this.request.getParameter('itemId');
                var quantity = this.request.getParameter('quantity');

                this.sendContent(WarehouseModel.getEligibleWarehousePerItem (
                    requestType,
					address,
                    itemId,
                    quantity
				), {
					'cache': response.CACHE_DURATION_UNIQUE
				});
			},

			post: function post() {
				var content = WarehouseModel.searchWarehouses(this.data);
				this.sendContent(content);
			}

		});
	}
);