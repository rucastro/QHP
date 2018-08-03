
define('CheckoutFieldManagement', [
    'OrderWizard.Module.CheckoutFieldManagement',
    'SC.Configuration',
    'underscore'
], function CheckoutFieldManagement(
    OrderWizardModuleCheckoutFieldManagement,
    Configuration,
    _
) {
    'use strict';

    return {
        getInsertStep: function getInsertStep() {
            switch (Configuration.get('checkoutApp.checkoutSteps')) {
            case 'One Page':
                return 'Checkout Information';
            case 'Billing First':
            case 'Standard':
            default:
                return 'Payment';
            }
        },

        getEditUrl: function getEditUrl() {
            switch (Configuration.get('checkoutApp.checkoutSteps')) {
            case 'One Page':
                return '/opc';
            case 'Billing First':
            case 'Standard':
            default:
                return '/billing';
            }
        },

        mountToApp: function mountToApp() {
            var insertStep = this.getInsertStep();

            var paymentModule = _.find(Configuration.get('checkoutSteps'),
                                       function findPayment(step) {
                                           return step.name === insertStep;
                                       });

            var reviewModule = _.find(Configuration.get('checkoutSteps'),
                                      function findPayment(step) {
                                          return step.name === 'Review';
                                      });

            if (paymentModule) {
                paymentModule.steps[0].modules.push(OrderWizardModuleCheckoutFieldManagement);
            }

            if (reviewModule) {
                reviewModule.steps[0].modules.push([OrderWizardModuleCheckoutFieldManagement, {
                    readOnly: true,
                    editUrl: this.getEditUrl()
                }]);
            }
        }
    };
});
