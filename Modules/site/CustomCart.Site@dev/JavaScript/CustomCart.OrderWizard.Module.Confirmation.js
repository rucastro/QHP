define('CustomCart.OrderWizard.Module.Confirmation', [
    'OrderWizard.Module.Confirmation'

], function CustomCartOrderWizardModuleConfirmation (
    OrderWizardModuleConfirmation

) {
    'use strict';

    OrderWizardModuleConfirmation.prototype._isReadFromConfirmation = function _isReadFromConfirmation() {
        var confirmation = this.wizard.model.get('confirmation');
        // You need to read from confirmation from the wizards (checkout) that have the isExternalCheckout and the return value is true (when returning from an external payment method)
        // Other wizards, like QuoteToSalesOrder, does not make the confirmation hack

        console.log('confirmation', confirmation);

        var	read_from_confirmation = confirmation && confirmation.internalid && this.wizard.isExternalCheckout;

        return read_from_confirmation;
    };
});