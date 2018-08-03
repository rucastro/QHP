define('HashtagGallery.Collection', [
    'Backbone.CachedCollection',
    'HashtagGallery.Model',
    'underscore',
    'Utils'
], function HashtagGalleryCollection(
    CachedCollection,
    Model,
    _
) {
    'use strict';

    return CachedCollection.extend({
        url: _.getAbsoluteUrl('services/HashtagGallery.Service.ss'),
        model: Model,
        parse: function parse(data) {
            this.hashtags = data.hashtags;
            this.page = data.page;
            this.recordsPerPage = data.recordsPerPage;
            this.totalRecordsFound = data.totalRecordsFound;
            this.totalPages = Math.ceil(this.totalRecordsFound / this.recordsPerPage);

            return data.records;
        }
    });
});
