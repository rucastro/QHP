define('ContactUs.Modal.View', [
    'Backbone',
    'contact_us_modal.tpl',
    'SC.Configuration',
    'underscore',
    'Utils'
], function ContactUsModalView(
    Backbone,
    contactUsModalTpl,
    Configuration,
    _
) {
    'use strict';

    return Backbone.View.extend({
        template: contactUsModalTpl,
        getContext: function getContext() {
            return {
                successTitle: _(Configuration.get('contactUs.successTitle')).translate(),
                successMessage: _(Configuration.get('contactUs.successMessage')).translate()
            };
        }
    });
});
