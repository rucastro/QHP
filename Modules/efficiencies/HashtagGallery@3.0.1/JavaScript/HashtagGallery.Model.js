define('HashtagGallery.Model', [
    'Backbone',
    'underscore',
    'Utils'
], function HashtagGalleryModel(
    Backbone,
    _
) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: _.getAbsoluteUrl('services/HashtagGallery.Service.ss')
    });
});
