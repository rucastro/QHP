/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Transaction.Line.Views
define(
	'Transaction.Line.Views.Price.View'
,	[
		'Profile.Model'
	,	'Session'
	,	'SC.Configuration'
	,	'transaction_line_views_price.tpl'

	,	'Backbone'
	]
,	function(
		ProfileModel
	,	Session
	,	Configuration
	,	transaction_line_views_price_tpl

	,	Backbone

	)
{
	'use strict';

	// @class Transaction.Line.Views.Price.View @extends Backbone.View
	return Backbone.View.extend(
	{
		//@property {Function} template
		template: transaction_line_views_price_tpl

		//@method initialize
		//@param {Transaction.Line.Views.Price.View.Options} options
		//@return {Void}
	,	initialize: function ()
		{
			this.profileModel = ProfileModel.getInstance();
		}

		//@method getUrlLogin Get the login URL contains an origin hash parameter indicating the current URL to came back after login
		//@return {String}
	,	getUrlLogin: function ()
		{
			var url = Session.get('touchpoints.login') + '&origin=' + (Configuration.get('currentTouchpoint') || 'home') + '&origin_hash=';

			return url + encodeURIComponent(this.options.origin === 'PDPQUICK' ? this.model.generateURL().replace('/', '') : Backbone.history.fragment);
		}

		// @method getContext
		// @returns {Transaction.Line.Views.Price.View.Context}
	,	getContext: function ()
		{
			var price_container_object = this.model.getPrice()
			,	showComparePrice = price_container_object.price < price_container_object.compare_price;

			//@class Transaction.Line.Views.Price.View.Context
			return {
				// @property {Transaction.Line.Model} model
				model: this.model
				// @property {Boolean} showComparePrice
			,	showComparePrice: showComparePrice
				// @property {Boolean} isInStock
			,	isInStock: !!this.model.getStockInfo().isInStock
				// @property {String} currencyCode
			,	currencyCode: SC.getSessionInfo('currency').code || ''
				// @property {String} comparePriceFormatted
			,	comparePriceFormatted: price_container_object.compare_price_formatted || ''
				// @property {Number} price
			,	price: price_container_object.price || 0
				// @property {String} rateFormatted
			,	rateFormatted: this.model.get('rate_formatted') || price_container_object.price_formatted || ''
				// @property {Boolean} isPriceEnabled
				//We've got to disable passwordProtectedSite and loginToSeePrices features if customer registration is disabled.
			,	isPriceEnabled: !(Configuration.getRegistrationType() !== 'disabled' && SC.ENVIRONMENT.siteSettings.requireloginforpricing==='T' && this.profileModel.get('isLoggedIn') !== 'T')
				// @property {String} urlLogin
			,	urlLogin: this.getUrlLogin()
			};
			//@class Transaction.Line.Views.Price.View
		}
	});
});
