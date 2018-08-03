
define('LocalizationPatch.Base', [
    'SC.Configuration',
    'Utils',
    'underscore',
    'jQuery',

    'Transaction.Line.Model',

    'LiveOrder.Model',
    'OrderHistory.Model',
    'ReturnAuthorization.Model',
    'Quote.Model',
    'Invoice.Model',

    'Cart.Summary.View',
    'OrderWizard.Module.CartSummary',
    'OrderHistory.Summary.View',
    'ReturnAuthorization.Detail.View',
    'Quote.Details.View',
    'Invoice.Details.View',

    'Backbone.View.render',
    'ListHeader.View',
    'PrintStatement.View',

    'OrderWizard.Module.CartItems'
], function LocalizationPatchBase(
    Configuration,
    Utils,
    _,
    jQuery,

    TransactionLineModel,

    LiveOrderModel,
    OrderHistoryModel,
    ReturnAuthorizationModel,
    QuoteModel,
    InvoiceModel,

    CartSummaryView,
    OrderWizardModuleCartSummary,
    OrderHistorySummaryView,
    ReturnAuthorizationDetailView,
    QuoteDetailsView,
    InvoiceDetailsView,

    BackboneViewRender,
    ListHeaderView,
    PrintStatementView,

    OrderWizardModuleCartItems
) {
    'use strict';

    return {
        // Format number to currency
        formatPrice: function formatPrice(price) {
            var amount = price || price === 0 ? parseFloat(price).toFixed(2) : '';
            var symbol = SC.ENVIRONMENT.currentCurrency.symbol;
            return SC.ENVIRONMENT.currentCurrency.symbolplacement === 2 ? amount + symbol : symbol + amount;
        },

        // Modify line values to reflect tax inclusive pricing
        onLineChange: function onLineChange(model) {
            var total = parseFloat(model.get('total'));
            var quantity = model.get('quantity');
            var amount;
            var taxRate;
            var newTotal;

            if (model.get('tax_rate')) {
                // MyAccount
                taxRate = parseFloat(model.get('tax_rate')) / 100 || 0;
                newTotal = total - (model.get('discount') * taxRate);
                model.attributes.amount_formatted = this.formatPrice(total + model.get('discount'));
                model.attributes.total_formatted = this.formatPrice(newTotal);
            } else {
                // Shopping & Checkout
                amount = parseFloat(model.get('amount'));
                taxRate = parseFloat(model.get('tax_rate1')) / 100;
                newTotal = total + (total * taxRate);
                model.attributes.total = newTotal;
                model.attributes.total_formatted = this.formatPrice(model.attributes.total);
                model.attributes.amount = amount + (amount * taxRate);
                model.attributes.amount_formatted = this.formatPrice(model.attributes.amount);
            }

            model.attributes.rate = newTotal / quantity;
            model.attributes.rate_formatted = this.formatPrice(model.attributes.rate);
        },

        // Modify summary to include tax inclusive pricing
        /* eslint-disable complexity */
        onSummaryChange: function onSummaryChange(options, model) {
            var summary = _.clone(model.get('summary'));

            if (summary) {
                if (options && options.hideTaxLine) {
                    if (summary.totalcombinedtaxes) {
                        summary.subtotal += summary.totalcombinedtaxes;
                    } else {
                        if (summary.taxtotal) summary.subtotal += summary.taxtotal;
                        if (summary.tax2total) summary.subtotal += summary.tax2total;
                    }

                    if (summary.shippingcost) {
                        summary.shippingcost += summary.taxonshipping || 0;
                        summary.shippingcost_formatted = this.formatPrice(summary.shippingcost);
                        summary.subtotal -= summary.taxonshipping || 0;
                    }

                    if (summary.handlingcost) {
                        summary.handlingcost += summary.taxonhandling || 0;
                        summary.handlingcost_formatted = this.formatPrice(summary.handlingcost);
                        summary.subtotal -= summary.taxonhandling || 0;
                    }

                    summary.subtotal_formatted = this.formatPrice(summary.subtotal);
                }

                if (summary.handlingcost && options && options.hideHandlingLine) {
                    summary.shippingcost += summary.handlingcost;
                    summary.shippingcost_formatted = this.formatPrice(summary.shippingcost);
                }

                _.extend(model.get('summary'), summary);
            }
        },
        /* eslint-enable */

        // Summary lines to hide
        hideLinesAfterRender: function hideLinesAfterRender(options, view) {
            if (options.hideTaxLine) view.$el.find(options.summaryTaxLine).parent().hide();
            if (options.hideHandlingLine) view.$el.find(options.summaryHandlingLine).parent().hide();
        },

        // Check date format
        isDefaultDateFormat: function isDefaultDateFormat(src) {
            return src && src.search(/^\d{4}-\d{2}-\d{2}$/) !== -1;
        },

        // Modify date to correct format
        changeDateFormat: function changeDateFormat(src) {
            return src ? src.split('-').reverse().join('-') : src;
        },

        // Keep transaction lines updated with tax inclusive display values
        transactionLineModel: function transactionLineModel() {
            var self = this;
            TransactionLineModel.prototype.initialize = _.wrap(TransactionLineModel.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.on('change', self.onLineChange.bind(self));
                this.trigger('change', this);
            });
        },

        // Keep order summary updated with tax inclusive values
        liveOrderModel: function liveOrderModel(options) {
            var self = this;
            LiveOrderModel.getInstance().on('change:summary', this.onSummaryChange.bind(this, options));
            LiveOrderModel.getInstance().on('change:confirmation', function confirmationChange(opts, model) {
                self.onSummaryChange.call(self, opts, model.get('confirmation'));
            }.bind(self, options));
        },

        // Keep order history summary updated with tax inclusive values
        orderHistoryModel: function orderHistoryModel(options) {
            var self = this;
            OrderHistoryModel.prototype.initialize = _.wrap(OrderHistoryModel.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.on('change:summary', self.onSummaryChange.bind(self, options));
            });
        },

        // Keep return summary updated with tax inclusive values
        returnAuthorizationModel: function returnAuthorizationModel(options) {
            var self = this;
            ReturnAuthorizationModel.prototype.initialize = _.wrap(ReturnAuthorizationModel.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.on('change:summary', self.onSummaryChange.bind(self, options));
            });
        },

        // Keep quote summary updated with tax inclusive values
        quoteModel: function quoteModel(options) {
            var self = this;
            QuoteModel.prototype.initialize = _.wrap(QuoteModel.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.on('change:summary', self.onSummaryChange.bind(self, options));
            });
        },

        // Keep invoice summary updated with tax inclusive values
        invoiceModel: function invoiceModel(options) {
            var self = this;
            InvoiceModel.prototype.initialize = _.wrap(InvoiceModel.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.on('change:summary', self.onSummaryChange.bind(self, options));
            });
        },

        // Hide separate tax and handling line
        cartSummaryView: function cartSummaryView(options) {
            var self = this;
            CartSummaryView.prototype.initialize = _.wrap(CartSummaryView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.on('afterViewRender', self.hideLinesAfterRender.bind(null, _.extend(options, {
                    summaryTaxLine: '.cart-summary-amount-tax',
                    summaryHandlingLine: '.cart-summary-amount-handling'
                })));
            });
        },

        // Hide separate tax and handling line
        orderWizardModuleCartSummary: function orderWizardModuleCartSummary(options) {
            var self = this;
            OrderWizardModuleCartSummary.prototype.initialize = _.wrap(OrderWizardModuleCartSummary.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.on('afterViewRender', self.hideLinesAfterRender.bind(null, _.extend(options, {
                    summaryTaxLine: '.order-wizard-cart-summary-tax-total-formatted',
                    summaryHandlingLine: '.order-wizard-cart-summary-handling-cost-formatted'
                })));
            });
        },

        // Hide separate tax and handling line
        orderHistorySummaryView: function orderHistorySummaryView(options) {
            var self = this;
            OrderHistorySummaryView.prototype.initialize = _.wrap(OrderHistorySummaryView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.on('afterViewRender', self.hideLinesAfterRender.bind(null, _.extend(options, {
                    summaryTaxLine: '.order-history-summary-summary-amount-tax',
                    summaryHandlingLine: '.order-history-summary-summary-amount-handling'
                })));
            });
        },

        // Hide separate tax and handling line
        returnAuthorizationDetailView: function returnAuthorizationDetailView(options) {
            var self = this;
            ReturnAuthorizationDetailView.prototype.initialize = _.wrap(ReturnAuthorizationDetailView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.on('afterViewRender', self.hideLinesAfterRender.bind(null, _.extend(options, {
                    summaryTaxLine: '.return-authorization-detail-summary-amount-tax',
                    summaryHandlingLine: '.return-authorization-detail-summary-amount-handling'
                })));
            });
        },

        // Hide separate tax and handling line
        quoteDetailsView: function quoteDetailsView(options) {
            var self = this;
            QuoteDetailsView.prototype.initialize = _.wrap(QuoteDetailsView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.on('afterViewRender', self.hideLinesAfterRender.bind(null, _.extend(options, {
                    summaryTaxLine: '.quote-details-summary-amount-tax',
                    summaryHandlingLine: '.quote-details-summary-handling-cost-formatted'
                })));
            });
        },

        // Hide separate tax and handling line
        invoiceDetailsView: function invoiceDetailsView(options) {
            var self = this;
            InvoiceDetailsView.prototype.initialize = _.wrap(InvoiceDetailsView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.on('afterViewRender', self.hideLinesAfterRender.bind(null, _.extend(options, {
                    summaryTaxLine: '.invoice-details-summary-tax-total',
                    summaryHandlingLine: '.invoice-details-summary-handling-value'
                })));
            });
        },

        // Display datepicker in dd-MM-YYYY format
        backboneViewRender: function backboneViewRender(options) {
            var self = this;
            var lpOnChange = function lpOnChange(event) {
                var $target = jQuery(event.target);
                var dateStr = $target.val();
                if (self.isDefaultDateFormat(dateStr)) {
                    $target.val(self.changeDateFormat(dateStr));
                }
            };

            if (options.useDatePicker && BackboneViewRender && BackboneViewRender.postRender && BackboneViewRender.postRender.install) {
                BackboneViewRender.postRender.install({
                    name: 'datePickerFormatChange',
                    priority: 9,
                    execute: function execute($el, view) {
                        view.$('[data-format="yyyy-mm-dd"]').each(function each(k, v) {
                            var $v = jQuery(v);
                            $v.off('change', lpOnChange);
                            $v.on('change', lpOnChange);
                            $v.change();
                        });
                    }
                });
            }
        },

        // Reformat date to expected format
        listHeaderView: function listHeaderView() {
            var self = this;
            ListHeaderView.prototype.validateDateRange = _.wrap(ListHeaderView.prototype.validateDateRange, function validateDateRange(fn) {
                var args = _.toArray(arguments).slice(1);
                if (!self.isDefaultDateFormat(args[0].from)) args[0].from = self.changeDateFormat(args[0].from);
                if (!self.isDefaultDateFormat(args[0].to)) args[0].to = self.changeDateFormat(args[0].to);
                return fn.apply(this, args);
            });
        },

        // Reformat date to expected format
        printStatementView: function printStatementView() {
            var self = this;
            PrintStatementView.prototype.initialize = _.wrap(PrintStatementView.prototype.initialize, function initialize(fn) {
                fn.apply(this, _.toArray(arguments).slice(1));
                this.model.on('change:statementDate change:startDate', function dateChange(model) {
                    var statementDate = model.get('statementDate');
                    var startDate = model.get('startDate');
                    if (!self.isDefaultDateFormat(statementDate)) model.attributes.statementDate = self.changeDateFormat(statementDate);
                    if (!self.isDefaultDateFormat(startDate)) model.attributes.startDate = self.changeDateFormat(startDate);
                });
            });

            // @override
            PrintStatementView.prototype.printStatement = function printStatement(e, email, callback) {
/* eslint-disable */
			e.preventDefault();
			this.hideError();

			this.model.set('statementDate', this.$('[name="statementDate"]').val());
			this.model.set('startDate', this.$('[name="startDate"]').val());

			if (this.model.isValid(true))
			{
                            // Change start
				// var data = jQuery(e.target).closest('form').serializeObject()
				// ,	statementDate = new Date(data.statementDate.replace(/-/g,'/')).getTime()
				// ,	startDate = new Date(data.startDate.replace(/-/g,'/')).getTime();

                            var data = jQuery(e.target).closest('form').serializeObject();
                            if (!self.isDefaultDateFormat(data.statementDate)) data.statementDate = self.changeDateFormat(data.statementDate);
                            if (!self.isDefaultDateFormat(data.startDate)) data.startDate = self.changeDateFormat(data.startDate);
                            var statementDate = new Date(data.statementDate.replace(/-/g,'/')).getTime();
                            var startDate = new Date(data.startDate.replace(/-/g,'/')).getTime();
                            // Change end

				data.email = email ? true : null;

				if (!(data.startDate && isNaN(startDate) || isNaN(statementDate)))
				{
					data.statementDate = statementDate;

					if (data.startDate)
					{
						data.startDate = startDate;
					}

					if (email)
					{
						var	save_promise = this.saveForm(e, this.model, data);
						save_promise && save_promise.done(callback);
					}
					else
					{
						data.asset = 'print-statement';
						window.open(_.getDownloadPdfUrl(data));
					}
				}
			}
/* eslint-enable */
            };
        },

        // Fix item amount display in orderwizard cart
        orderWizardModuleCartItems: function orderWizardModuleCartItems() {
            OrderWizardModuleCartItems.prototype.childViews['Items.Collection'] = _.wrap(
                OrderWizardModuleCartItems.prototype.childViews['Items.Collection'],
                function itemCollectionChildView(fn) {
                    var retVal = fn.apply(this, _.toArray(arguments).slice(1));
                    retVal.childViewOptions.detail3 = 'total_formatted';
                    return retVal;
                });
        },

        loadModule: function loadModule(options) {
            // Update order lines
            this.transactionLineModel();

            // Update order summaries
            this.liveOrderModel(options);
            this.orderHistoryModel(options);
            this.returnAuthorizationModel(options);
            this.quoteModel(options);
            this.invoiceModel(options);

            // Format order summaries
            this.cartSummaryView(options);
            this.orderWizardModuleCartSummary(options);
            this.orderHistorySummaryView(options);
            this.returnAuthorizationDetailView(options);
            this.quoteDetailsView(options);
            this.invoiceDetailsView(options);

            // Format dates
            this.backboneViewRender(options);
            this.listHeaderView();
            this.printStatementView();

            // Fix issue in order wizard cart
            this.orderWizardModuleCartItems();
        }
    };
});
