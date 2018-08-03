define('CheckoutFieldManagement.Model', [
    'SC.Model',
    'Configuration',
    'underscore'
], function CheckoutFieldManagementModel(
    SCModel,
    Configuration,
    _
) {
    'use strict';

    return SCModel.extend({
        name: 'CheckoutFieldManagement',

        supportedTypes:
        [
            'checkbox',
            'select',
            'textarea',
            'text'
        ],

        get: function get() {
            var salesRecord;

            try {
                salesRecord = nlapiCreateRecord('salesorder');
                return _.compact(_.map(Configuration.get('checkoutFieldManagementList'), function map(field) {
                    var fieldId = field.fieldId;
                    var recordField;
                    var fieldType;
                    var defaultValue;
                    var retVal = {};

                    if (!fieldId || fieldId.indexOf('custbody_') !== 0) {
                        nlapiLogExecution('ERROR', 'CheckoutFieldManagement.Model',
                                          fieldId + ' is not a valid field id.');
                        return null;
                    }

                    try {
                        recordField = salesRecord.getField(field.fieldId);
                    } catch (e) {
                        nlapiLogExecution('ERROR', 'CheckoutFieldManagement.Model getField', e);
                        return null;
                    }

                    if (!recordField) {
                        nlapiLogExecution('ERROR', 'CheckoutFieldManagement.Model',
                                          'Could not load custom transaction body field ' + recordField);
                        return null;
                    }

                    fieldType = recordField.getType();
                    if (!_.contains(this.supportedTypes, fieldType)) {
                        nlapiLogExecution('ERROR', 'CheckoutFieldManagement.Model',
                                          fieldType + ' is not a supported field type.');
                        return null;
                    }

                    defaultValue = field.defaultValue || '';
                    if (fieldType === 'checkbox') {
                        defaultValue = this.getCheckboxValue(defaultValue);
                    }

                    if (fieldType === 'select') {
                        try {
                            retVal.options = _.map(recordField.getSelectOptions(),
                                                   function mapOptions(option) {
                                                       return {
                                                           id: option.getId(),
                                                           text: option.getText()
                                                       };
                                                   });
                        } catch (e) {
                            nlapiLogExecution('ERROR', 'CheckoutFieldManagement.Model getSelectOptions', e);
                            return null;
                        }
                    }

                    return _.extend(retVal, {
                        id: field.fieldId,
                        text: field.label || recordField.getLabel(),
                        required: !!field.required,
                        defaultValue: defaultValue,
                        help: field.helpText || '',
                        type: fieldType
                    });
                }, this));
            } catch (e) {
                nlapiLogExecution('ERROR', 'CheckoutFieldManagement.Model catch', e);
                return [];
            }
        },

        getCheckboxValue: function getCheckboxValue(defaultValue) {
            var toLower = defaultValue.toLowerCase();
            return (toLower === 't' || toLower === 'true') ? 'T' : defaultValue;
        }
    });
});
