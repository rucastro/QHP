
define('CheckoutFieldManagement.TextArea.View', [
    'checkoutfieldmanagement_textarea.tpl',
    'Backbone'
], function CheckoutFieldManagementTextAreaView(
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
