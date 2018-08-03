define('Warehouse', [
    'OrderWizard.Module.Warehouse',

    'SC.Configuration',
    'SC.Checkout.Configuration',
    'underscore'
], function Warehouse (
    OrderWizardModuleWarehouse,

    Configuration,
    SCCheckoutConfiguration,
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
                    return 'Shipping Address';
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
                    return '/billing';
                default:
                    return '/billing';
            }
        },

        mountToApp: function () {
            var insertStep = this.getInsertStep();

            var shippingAddressModule = _.find(Configuration.get('checkoutSteps'),
                function findPayment(step) {
                    return step.name === insertStep;
                });

            //console.log('shippingAddressModule', shippingAddressModule);

            var reviewModule = _.find(Configuration.get('checkoutSteps'),
                function findPayment(step) {
                    return step.name === 'Review';
                });

            if (shippingAddressModule) {
                //shippingAddressModule.steps[0].modules.push(OrderWizardModuleWarehouse);
                shippingAddressModule.steps[0].modules.splice(2, 0, OrderWizardModuleWarehouse);
            }


            if (reviewModule) {
                //console.log('reviewModule.steps[0].modules', reviewModule.steps[0].modules);

                reviewModule.steps[0].modules.splice(13, 0, [OrderWizardModuleWarehouse, {
                    readOnly: true,
                    editUrl: this.getEditUrl()
                }]);
            }


        }
    }
});