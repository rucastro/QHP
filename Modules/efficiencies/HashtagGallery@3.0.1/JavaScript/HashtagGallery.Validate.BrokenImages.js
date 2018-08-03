define('HashtagGallery.Validate.BrokenImages', [
    'HashtagGallery.Model',
    'Backbone',
    'underscore'
], function HashtagGalleryExtendItemDetails(
    HashtagGalleryModel,
    Backbone,
    _
) {
    'use strict';

    _.extend(HashtagGalleryModel.prototype, {
        imageExist: function imageExist(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function stateReady() {
                if (xhr.readyState === 4) {
                    callback(xhr.status < 400);
                }
            };

            xhr.open('HEAD', url, false);
            xhr.send();
        },

        checkImage: function checkImage() {
            var self = this;
            var result = '';
            this.imageExist(self.get('lowresAsset'), function imageExist(exists) {
                result = exists;
            });

            return result;
        }
    });
});
