define('GuestOrderStatus.View', [
    'GuestOrderStatus.Details.View',
    'GuestOrderStatus.Model',
    'guestorderstatus.tpl',
    'Backbone.CompositeView',
    'Backbone.FormView',
    'Backbone',
    'jQuery',
    'underscore',
    'Utils'
], function GuestOrderStatusView(
    GuestOrderStatusDetailsView,
    Model,
    orderStatusTpl,
    BackboneCompositeView,
    BackboneFormView,
    Backbone,
    jQuery,
    _
) {
    'use strict';

    return Backbone.View.extend({
        template: orderStatusTpl,

        title: _('Guest Order Status').translate(),

        events: {
            'submit form': 'saveForm',
            'reset form': 'resetForm',
            'change [name=secondField]': 'changeSecondField'
        },

        childViews: {
            'GuestOrderStatus.Details': function GuestOrderStatusDetails() {
                return new GuestOrderStatusDetailsView({
                    application: this.application,
                    model: this.model
                });
            }
        },

        getBreadcrumbPages: function getBreadcrumbPages() {
            return [{
                text: this.title,
                href: '/guestorderstatus'
            }];
        },

        initialize: function initialize(options) {
            var self = this;
            this.application = options.application;
            this.model = new Model();
            BackboneFormView.add(this);
            BackboneCompositeView.add(this);
            this.model.on('save', _.bind(this.showContent, this));
            this.on('afterCompositeViewRender', function afterCompositeViewRender() {
                self.model.clear();
            });
        },

        resetForm: function resetForm(e) {
            e.preventDefault();
            this.model.clear();
            this.showContent();
        },

        changeSecondField: function changeSecondField() {
            var secondaryChosen = this.$('[name=secondField]').val() || 'email';

            this.$('[data-secondary=T]').hide().val('');
            this.$('[data-secondary-value=' + secondaryChosen + ']').show();
        },

        render: function render() {
            this._render();
            this.changeSecondField();
            return this;
        },

        getContext: function getContext() {
            return {
                orderid: this.model.get('orderid'),
                secondFieldSelected: null,
                secondFieldValue: null,
                secondFields: this.application.getConfig('modulesConfig.GuestOrderStatus.secondField'),
                isBOPISEnabled: this.application.getConfig('modulesConfig.GuestOrderStatus.isBOPISEnabled')
            };
        }
    });
});
