
define('CheckoutFieldManagement.Text.View', [
    'checkoutfieldmanagement_text.tpl',
    'Backbone'
], function CheckoutFieldManagementTextView(
    template,
    Backbone
) {
    'use strict';

    return Backbone.View.extend({
        template: template,

        getContext: function getContext() {
            return {
                id: this.options.fieldInfo.get('id'),
                text: this.options.fieldInfo.get('text'),
                required: this.options.fieldInfo.get('required'),
                defaultValue: this.options.currentValue,
                help: this.options.fieldInfo.get('help'),
                readOnly: this.options.readOnly
            };
        }
    });
});
