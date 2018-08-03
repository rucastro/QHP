define('{{viewFile}}', [
    '{{template}}.tpl',
    'Backbone',
    'underscore'
], function {{viewClass}}(
    {{templateVar}}Tpl,
    Backbone,
    _
) {
    'use strict';

    return Backbone.View.extend({

        template: {{templateVar}}Tpl,

        attributes: {
            'class': '{{sassClass}}'
        },

        initialize: function initialize(options) {
            this.application = options.application;
            this.model = options.model;
            this.title = _('{{moduleName}}').translate();
        },

        getBreadcrumbPages: function getBreadcrumbPages() {
            return {
                text: this.title,
                href: '/{{routerUrl}}'
            };
        },

        getContext: function getContext() {
            return {
                model: this.model
            };
        }
    });
});
