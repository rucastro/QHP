define('ProductDetails.Full.View.VideoOnGallery', [
    'ProductDetails.Full.View',
    'ProductDetails.Full.ImageGallery.View.Video',
    'SC.Configuration',
    'underscore',
    'Utils'
], function ProductDetailsViewVideo(
    ProductDetailsFullView,
    ItemDetailsImageGalleryViewVideo,
    Configuration,
    _,
    Utils
) {
    'use strict';

    _.extend(ProductDetailsFullView.prototype.childViews, {
        'Product.ImageGallery': function ItemDetailsImageGallery() {
            var images = this.model.getImages();
            var hasVideo = false;

            if (this.model.get('item').get('custitem_ef_pdp_video_url')) {
                // Push the video
                images.push({
                    altimagetext: _('Video').translate(),
                    url: this.model.get('item').get('custitem_ef_pdp_video_url'),
                    isVideo: true,
                    thumb: Utils.getAbsoluteUrl('img/default-video-thumbnail.jpg')
                });
                // If we have a video, we should remove image not available. And leave the video as main
                images = _.filter(images, function filterImages(image) {
                    return image.url !== Configuration.imageNotAvailable;
                });
            }

            return new ItemDetailsImageGalleryViewVideo({
                images: images,
                hasVideo: hasVideo,
                model: this.model
            });
        }
    });
});
