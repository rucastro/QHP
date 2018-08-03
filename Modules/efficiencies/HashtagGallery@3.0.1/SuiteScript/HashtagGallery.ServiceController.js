define('HashtagGallery.ServiceController', [
    'ServiceController',
    'Application',
    'HashtagGallery.Model',
    'underscore'
], function HashtagGalleryServiceController(
    ServiceController,
    Application,
    HashtagGalleryModel,
    _
) {
    'use strict';

    return ServiceController.extend({
        name: 'HashtagGallery.ServiceController',

        get: function get() {
            var page = this.request.getParameter('page');
            var hashtags = (this.request.getParameter('hashtags') || '').split(',');

            hashtags = _.compact(_.unique(_.map(hashtags,
                function map(h) {
                    return h && h.toString && h.toString() && h.toString().trim();
                }
            )));

            this.sendContent(HashtagGalleryModel.search(hashtags, page), {
                'cache': response.CACHE_DURATION_MEDIUM
            });
        }
    });
});
