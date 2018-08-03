
define('CheckoutFieldManagement.View', [
    'checkoutfieldmanagement.tpl',
    'CheckoutFieldManagement.Checkbox.View',
    'CheckoutFieldManagement.Select.View',
    'CheckoutFieldManagement.Text.View',
    'CheckoutFieldManagement.TextArea.View',
    'Backbone.CompositeView',
    'Backbone.FormView',
    'Backbone',
    'Handlebars'
], function CheckoutFieldManagementView(
    template,
    CheckoutFieldManagementCheckboxView,
    CheckoutFieldManagementSelectView,
    CheckoutFieldManagementTextView,
    CheckoutFieldManagementTextAreaView,
    BackboneCompositeView,
    BackboneFormView,
    Backbone,
    Handlebars
) {
    'use strict';

    Handlebars.registerHelper('checkoutfieldmanagement_isequal', function checkoutFieldManagementIsEqual(a, b, options) {
        return (a && b && a.toString() === b.toString()) ? options.fn(this) : '';
    });

    return Backbone.View.extend({
        template: template,

        bindings: {},
        childViews: {},

        initialize: function initialize(options) {
            this.model = options.model;

            options.collection.each(function each(field) {
                var id = field.get('id');
                var childView = {};
                this.bindings['[name="' + id + '"]'] = id;
                childView['CheckoutFieldManagement.' + id + '.View'] = this.generateChildView.bind(this, {
                    fieldInfo: field,
                    currentValue: this.getCurrentValue(field.get('defaultValue'), this.model.get(id)),
                    readOnly: options.readOnly
                });
                this.addChildViews(childView);
            }, this);

            BackboneCompositeView.add(this);
            BackboneFormView.add(this);
            Backbone.Validation.bind(this);
        },

        getCurrentValue: function getCurrentValue(defaultValue, currentValue) {
            return typeof (currentValue) !== 'undefined' ? currentValue : defaultValue;
        },

        generateChildView: function generateChildView(options) {
            var FieldView;

            switch (options.fieldInfo.get('type')) {
            case 'checkbox':
                FieldView = CheckoutFieldManagementCheckboxView;
                break;
            case 'textarea':
                FieldView = CheckoutFieldManagementTextAreaView;
                break;
            case 'select':
                FieldView = CheckoutFieldManagementSelectView;
                break;
            case 'text':
            default:
                FieldView = CheckoutFieldManagementTextView;
            }

            return new FieldView(options);
        },

        getContext: function getContext() {
            return {
                collection: this.options.collection
            };
        }
    });
});
