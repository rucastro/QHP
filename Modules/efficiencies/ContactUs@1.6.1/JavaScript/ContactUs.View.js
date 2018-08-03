define('ContactUs.View', [
    'contact_us.tpl',
    'Backbone.FormView',
    'jQuery',
    'Backbone',
    'SC.Configuration',
    'underscore',
    'ContactUs.Modal.View',
    'Utils'
], function ContactUsView(
    contactUsTpl,
    BackboneFormView,
    jQuery,
    Backbone,
    Configuration,
    _,
    ContactUsModalView
) {
    'use strict';

    // @class ContactUs.View @extends Backbone.View
    return Backbone.View.extend({

        template: contactUsTpl,
        title: _(Configuration.get('contactUs.pagetitle')).translate(),
        page_header: _(Configuration.get('contactUs.pagename')).translate(),

        events: {
            'submit form': 'saveTheForm'
        },

        bindings: {
            '[name="email"]': 'email',
            '[name="title"]': 'title',
            '[name="incomingmessage"]': 'incomingmessage'
        },
        attributes: {
            'class': 'contact-us'
        },

        getBreadcrumbPages: function getBreadcrumbPages() {
            return [{
                text: _(Configuration.get('contactUs.pagename')).translate(),
                href: '/contact-us'
            }];
        },
        initialize: function initialize(options) {
            var layout;
            var self = this;
            var configurationFields = Configuration.get('contactUs.fields');
            var objKey;
            var obj = {};

            this.options = options;
            this.application = options.application;
            this.model.on('sync', jQuery.proxy(this, 'showSuccess'));

            layout = this.application.getLayout();
            layout.on('afterAppendView', function onAfterAppendView() {
                self.setMetaTagsByConfiguration();
            });

            _.each(configurationFields, function eachConfigurationFields(fieldId) {
                if (fieldId.mandatory) {
                    objKey = '[name="' + fieldId.fieldId + '"]';
                    obj[objKey] = fieldId.fieldId;
                    self.bindings[objKey] = fieldId.fieldId;
                }
            });

            BackboneFormView.add(this);
        },

        setMetaTagsByConfiguration: function setMetaTagsByConfiguration() {
            // jQuery('meta[name=description]').attr('content', 'new value');
            var content = Configuration.get('contactUs.meta');

            jQuery('<meta />', {
                name: 'description',
                content: content
            }).appendTo(jQuery('head'));
        },

        // Prevents not desired behaviour when hitting enter
        preventEnter: function preventEnter(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
            }
        },

        saveTheForm: function saveTheForm(e) {
            var self = this;
            var promise = BackboneFormView.saveForm.apply(this, arguments);

            e.preventDefault();

            return promise && promise.then(function promiseSuccessCallback(data) {
                if (data.successMessage) {
                    self.showMessage(data.successMessage, 'success');
                    self.$('form').get(0).reset();
                } else {
                    self.showMessage('Error occurred, please try again.', 'error');
                }
            }, function promiseErrorCallback(jqXhr) {
                jqXhr.preventDefault = true;
                self.showMessage(jqXhr.responseJSON.errorMessage, 'error');
            });
        },

        showMessage: function showMessage(message, type) {
            var $message = this.$('.message').removeClass('hide message-success message-error');
            if (type === 'success') {
                this.ContactUsModalView = new ContactUsModalView({
                    application: this.application,
                    parentView: this,
                    model: this.model
                });
                this.application.getLayout().showInModal(this.ContactUsModalView);
                $message.addClass('message-success');
            } else {
                $message.addClass('message-error');
            }
            $message.text(message).fadeIn(400).delay(3000).fadeOut();
        },

        getContext: function getContext() {
            // @class ContactUs.View.Context
            return {
                // @property {String} pageHeader
                pageHeader: this.page_header,
                additionalFields: Configuration.get('contactUs.fields')
            };
        }
    });
});
