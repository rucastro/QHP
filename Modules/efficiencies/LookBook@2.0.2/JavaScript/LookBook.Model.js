define('LookBook.Model', [
    'Look.Collection',
    'Backbone',
    'Utils'
], function LookModel(
    LookCollection,
    Backbone,
    Utils
) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: Utils.getAbsoluteUrl('services/LookBook.Service.ss'),
        initialize: function initialize() {
            this.on('change:looks', function changeLooks(model, looks) {
                model.set('looks', new LookCollection(looks), { silent: true });
            });
        }
    });
});
