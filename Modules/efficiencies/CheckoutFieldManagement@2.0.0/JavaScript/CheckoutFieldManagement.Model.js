
define('CheckoutFieldManagement.Model', [
    'Backbone',
    'underscore',
    'Utils'
], function CheckoutFieldManagementModel(
    Backbone,
    _
) {
    'use strict';

    return Backbone.Model.extend({
        // Custom validation may be added here
        customValidation: {
            // 'custbody_field_id': function(value, attr, computedState) {
            //     if (!value) {
            //         return _('This field is required.').translate();
            //     }
            // }
        },

        validation: {},

        initialize: function initialize(options) {
            options.collection.each(function each(field) {
                var id;
                if (field.get('required')) {
                    id = field.get('id');
                    this.validation[id] = this.customValidation[id] || this.validator.bind(this, field);
                }
            }, this);
        },

        validator: function validator(fieldInfo, value) {
            var val = value;
            if (fieldInfo.get('type') === 'checkbox') val = val === 'T';
            return val ? undefined : _('$(0) is required.').translate(fieldInfo.get('text'));
        }
    });
});
