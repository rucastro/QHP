define('{{routerFile}}', [
    'Backbone',
    '{{viewFile}}'
], function {{routerClass}}(
    Backbone,
    {{viewClass}}
) {
    'use strict';

    return Backbone.Router.extend({

        routes: {
            '{{routerUrl}}': '{{routerName}}Page'
        },

        initialize: function initialize(options) {
            this.options = options;
        },

        {{routerName}}Page: function {{routerName}}Page() {
            var view = new {{viewClass}}({
                application: this.options.application
            });
            view.showContent();
        }
    });
});
