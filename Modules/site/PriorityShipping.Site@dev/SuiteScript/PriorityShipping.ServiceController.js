define('PriorityShipping.ServiceController',	[
	'ServiceController',
	'Application',
	'PriorityShipping.Model'
], function PriorityShippingServiceController(
	ServiceController,
	Application,
	PriorityShippingModel
) {
		'use strict';

		// @class PriorityShipping.ServiceController Manage shipping requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name:'PriorityShipping.ServiceController',
			
			get: function get() {

				var batchid = this.request.getParameter('batchid');
                var originzip = this.request.getParameter('originzip');
                var destzip = this.request.getParameter('destzip');
                var shipdate = this.request.getParameter('shipdate');
				var shipclass = this.request.getParameter('shipclass');
				var shipweight = this.request.getParameter('shipweight');

                this.sendContent(PriorityShippingModel.get (
					batchid,
					originzip,
					destzip,
					shipdate,
					shipclass,
					shipweight
				), {
					'cache': response.CACHE_DURATION_UNIQUE
				});
			},

			post: function post() {
				// var content = WarehouseModel.searchWarehouses(this.data);
				// this.sendContent(content);
			}

		});
	}
);