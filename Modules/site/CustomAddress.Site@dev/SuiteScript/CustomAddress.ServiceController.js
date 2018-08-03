define('CustomAddress.ServiceController',	[
	'ServiceController',
	'Application',
	'CustomAddress.GeoLocation.Model'
], function CustomAddressServiceController(
	ServiceController,
	Application,
    GeoLocationModel
) {
		'use strict';

		// @class CustomAddress.ServiceController Manage geo location requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name:'CustomAddress.ServiceController',
			
			get: function get() {

				var requestType = this.request.getParameter('requestType');
                var address = this.request.getParameter('address');
                var origin = this.request.getParameter('origin');
                var destination = this.request.getParameter('destination');
                var addressId = this.request.getParameter('addressId');
                var customerId = this.request.getParameter('customerId');

                this.sendContent(GeoLocationModel.getGeoLocationDetails(
                    requestType,
					address,
					origin,
					destination,
                    addressId,
                    customerId
				), {
					'cache': response.CACHE_DURATION_UNIQUE
				});
			},

			post: function post() {


			}

		});
	}
);