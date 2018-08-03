define('OrderWizard.Module.CheckoutFieldManagement', [
    'Wizard.Module',
    'order_wizard_checkoutfieldmanagement.tpl',
    'CheckoutFieldManagement.Field.Collection',
    'CheckoutFieldManagement.Model',
    'CheckoutFieldManagement.View',
    'SC.Configuration',
    'Backbone.CompositeView',
    'Backbone',
    'jQuery',
    'underscore'
], function OrderWizardModuleCheckoutFieldManagement(
    WizardModule,
    template,
    CheckoutFieldManagementFieldCollection,
    CheckoutFieldManagementModel,
    CheckoutFieldManagementView,
    Configuration,
    BackboneCompositeView,
    Backbone,
    jQuery,
    _
) {
    'use strict';

    return WizardModule.extend({
        cfm: null,

        readOnly: false,

        editUrl: null,

        template: template,

        moduleTitle: Configuration.get('checkoutFieldManagementTitle'),

        initialize: function initialize() {
            WizardModule.prototype.initialize.apply(this, arguments);

            this.loadCollection()
                .fail(this.render.bind(this))
                .done(function done() {
                    BackboneCompositeView.add(this);
                    this.render();
                    this.renderChild('CheckoutFieldManagementView');
                }.bind(this));
        },

        loadCollection: function loadCollection() {
            var promise = jQuery.Deferred();

            if (!this.wizard.checkoutFieldManagement) {
                this.wizard.checkoutFieldManagement = {
                    collection: new CheckoutFieldManagementFieldCollection()
                };
            }

            this.cfm = this.wizard.checkoutFieldManagement;

            if (this.cfm.isLoaded) {
                promise.resolve();
            } else if (this.cfm.isLoading) {
                this.cfm.collection.once('cfm_loaded', promise.resolve);
                this.cfm.collection.once('error', promise.reject);
            } else {
                this.cfm.isLoading = true;
                this.cfm.collection.fetch()
                    .always(function always() {
                        this.cfm.isLoading = false;
                    }.bind(this))
                    .fail(function fail(e) {
                        this.cfm.isLoaded = false;
                        promise.reject(e);
                    }.bind(this))
                    .done(function done() {
                        this.cfm.isLoaded = true;
                        this.cfm.model = new CheckoutFieldManagementModel({ collection: this.cfm.collection });
                        this.cfm.collection.each(function each(field) {
                            var id = field.get('id');
                            var defaultValue = field.get('defaultValue');
                            if (!this.cfm.model.get(id) && defaultValue) this.cfm.model.set(id, defaultValue);
                        }, this);
                        promise.resolve();
                        this.cfm.collection.trigger('cfm_loaded');
                    }.bind(this));
            }

            return promise;
        },

        childViews:
        {
            'CheckoutFieldManagementView': function checkoutFieldManagementViewChildView() {
                return new CheckoutFieldManagementView({
                    collection: this.cfm.collection,
                    model: this.cfm.model,
                    readOnly: this.options.readOnly
                });
            }
        },

        submit: function submit() {
            var promise = jQuery.Deferred();
            var options;

            if (this.cfm.isLoaded) {
                this.cfm.model.set(jQuery('fieldset[data-fieldset-type="checkoutfieldmanagement"]').serializeObject());
                if (!this.cfm.model.validate()) {
                    options = this.model.get('options');
                    this.cfm.collection.each(function each(field) {
                        var id = field.get('id');
                        options[id] = this.cfm.model.get(id) || '';
                    }, this);
                    this.model.set('options', options);
                    promise.resolve();
                } else {
                    promise.reject({
                        errorCode: 'ERR_CHECKOUT_FIELD_MANAGEMENT_FIELDS',
                        errorMessage: _('Please review $(0) fields.').translate(this.moduleTitle)
                    });
                }
            } else {
                promise.resolve();
            }

            return promise;
        },

        getContext: function getContext() {
            return {
                title: this.moduleTitle,
                readOnly: this.options.readOnly,
                editUrl: this.options.editUrl,
                isLoading: this.cfm.isLoading,
                isLoaded: this.cfm.isLoaded
            };
        }
    });
});
