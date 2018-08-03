define('LookBook.Router', [
    'LookBook.Model',
    'Look.Model',
    'LookBook.View',
    'Look.View',
    'Backbone'
], function LookBookRouter(
    LookBookModel,
    LookModel,
    LookBookView,
    LookView,
    Backbone
) {
    'use strict';

    return Backbone.Router.extend({
        routes: {
            'lookbook/:lookb': 'lookbook',
            'lookbook/:lookb?*': 'lookbook',
            'lookbook/:lookbook/:look': 'look',
            'lookbook/:lookbook/:look?*': 'look'
        },
        initialize: function initialize(application) {
            this.application = application;
        },
        lookbook: function lookbook(urlComponent) {
            var model = new LookBookModel();
            var view = new LookBookView({
                application: this.application,
                model: model
            });

            model.fetch({
                data: {
                    urlcomponent: urlComponent
                }
            }).done(function fulfilled() {
                view.showContent();
            });
        },
        look: function look(lookBookUrl, lookUrl) {
            var model = new LookModel();
            var view = new LookView({
                application: this.application,
                model: model
            });

            model.fetch({
                data: {
                    urlcomponent: lookUrl
                }
            }).done(function fulfilled() {
                view.showContent();
            });
        }
    });
});
