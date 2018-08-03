
// By default, shipping and handling tax breakdown is not included on all transaction data requests so include it where needed

define('LocalizationPatch.DeliveryTax', [
    'Utils',
    'Application'
], function LocalizationPatchDeliveryTax(
    Utils,
    Application
) {
    'use strict';

    // Return shipping and handling tax breakdown
    Application.on('after:LiveOrder.confirmationCreateResult', function confirmationCreateResult(model, result) {
        var rec = nlapiLoadRecord('salesorder', result.internalid);
        result.summary.taxonshipping = Utils.toCurrency(rec.getFieldValue('shippingtax1amt'));
        result.summary.taxonhandling = Utils.toCurrency(rec.getFieldValue('handlingtax1amt'));
    });

    // Return shipping and handling tax breakdown
    Application.on('after:Transaction.get', function get(model, result) {
        result.summary.taxonshipping = Utils.toCurrency(model.record.getFieldValue('shippingtax1amt'));
        result.summary.taxonhandling = Utils.toCurrency(model.record.getFieldValue('handlingtax1amt'));
    });
});
