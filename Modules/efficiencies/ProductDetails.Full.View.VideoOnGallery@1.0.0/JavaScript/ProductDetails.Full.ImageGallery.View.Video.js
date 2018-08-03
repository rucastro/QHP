define('ProductDetails.Full.ImageGallery.View.Video', [
    'Backbone.CompositeView',
    'ProductDetails.ImageGallery.View',
    'Utilities.ResizeImage',
    'jQuery',
    'underscore',
    'Utils',
    'item_details_image_gallery_video.tpl'
], function ProductDetailsImageGalleryViewVideo(
    BackboneCompositeView,
    ProductDetailsImageGalleryView,
    resizeImage,
    jQuery,
    _,
    Utils,
    itemDetailsImageGalleryVideoTpl
) {
    'use strict';

    var previousImages = [];
    return ProductDetailsImageGalleryView.extend({
        template: itemDetailsImageGalleryVideoTpl,
        /* eslint-disable */
        initialize: function initialize ()
        {
            Backbone.View.prototype.initialize.apply(this, arguments);
            BackboneCompositeView.add(this);

            var self = this;

            this.images = this.options.images; // VideoOnGallery-Customization

            this.model.on('change', function ()
            {
                var model_images = this.options.images; // VideoOnGallery-Customization
                if (!_.isEqual(this.images, model_images))
                {
                    this.images = model_images;
                    this.render();
                }
            }, this);

            this.on('afterViewRender', function ()
            {
                self.initSlider();
                self.initZoom();
            });
        },
        /* VideoOnGallery-Customization START */
        initSlider: function initSlider() {
            var self = this;
            if (self.options.images.length > 1) {
                self.$slider = self.$('[data-slider]');

                self.$slider = Utils.initBxSlider(self.$('[data-slider]'), {
                    buildPager: _.bind(self.buildSliderPager, self)
                    ,   startSlide: 0
                    ,   adaptiveHeight: true
                    ,   touchEnabled: true
                    ,   nextText: '<a class="product-details-image-gallery-next-icon" data-action="next-image"></a>'
                    ,   prevText: '<a class="product-details-image-gallery-prev-icon" data-action="prev-image"></a>'
                    ,   controls: true
                });
                self.$('[data-action="next-image"]').off();
                self.$('[data-action="prev-image"]').off();

                self.$('[data-action="next-image"]').click(_.bind(self.nextImageEventHandler, self));
                self.$('[data-action="prev-image"]').click(_.bind(self.previousImageEventHandler, self));
            }
        },
        /* VideoOnGallery-Customization END */
        /* eslint-enable */
        buildSliderPager: function buildSliderPager(slideIndex) {
            var image = this.options.images[slideIndex];
            if (image.isVideo) {
                return '<img src="' + resizeImage(image.thumb, 'tinythumb') + '" alt="' + image.altimagetext + '">';
            }
            return '<img src="' + resizeImage(image.url, 'tinythumb') + '" alt="' + image.altimagetext + '">';
        },

        /* Only copied because we need to reference the global vars */
        hasSameImages: function hasSameImages() {
            return this.options.images.length === previousImages.length &&
                _.difference(this.options.images, previousImages).length === 0;
        },
        destroy: function destroy() {
            if (this.$slider) {
                this.$slider.getCurrentSlide();
            }
            previousImages = this.options.images;
            this._destroy();
        }
        /*  END Only copied because we need to reference the global vars */
    });
});
