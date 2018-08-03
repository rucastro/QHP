define('ProductDetails.Full.ImageGallery.Extend', [
    'ProductDetails.ImageGallery.View',
    'Backbone.CompositeView',
    'Backbone',
    'Utils',
    'underscore'
], function ProductsDetailFullImageGalleryExtend(
    ProductDetailsImageGalleryView,
    BackboneCompositeView,
    Backbone,
    Utils,
    _
) {
    'use strict';

    _.extend(ProductDetailsImageGalleryView.prototype, {
        filterImages: function filterImages(images) {
        var imagesFiltered = _.filter(images, function (image) {
            var imageURL = image.url;
            var empty = ""
            //console.log(image);
            if (imageURL.indexOf('_assembly_') !== -1) {
                var imageURLStart = imageURL.substring(imageURL.indexOf('_assembly_'),imageURL.length);
                var imageURL_array = imageURLStart.split('_');

                if (imageURL_array.length > 3) {
                    var img_d = imageURL_array[4];
                    var img_id = img_d.substring(0,img_d.indexOf('.'));
                    //console.log('img',img_id);
                    if (img_id && img_id == '10') {
                        return false;
                    } else
                    {
                        return true;
                    }

                }
                else return true;
            } else return true;


            ///c.3704208/sca-dev-elbrus/img/no_image_available2.jpg
        });

            if (imagesFiltered.length == 0) {
                imagesFiltered.push("/c.3704208/sca-dev-elbrus/img/no_image_available2.jpg");
            }

        return imagesFiltered
    },
        initialize: function initialize() {
            Backbone.View.prototype.initialize.apply(this, arguments);
            BackboneCompositeView.add(this);

            var self = this;

            this.images = this.filterImages(this.model.getImages());
            this.model.on('change', function ()
            {
                var model_images = this.filterImages(this.model.getImages());
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
        getContext: function getContext()
        {
            var imagelist = this.images;

            //console.log('imagelist', imagelist);
            // @class ProductDetails.ImageGallery.View.Context
            return {
                // @property {String} imageResizeId
                imageResizeId: Utils.getViewportWidth() < 768 ? 'thumbnail' : 'main'
                //@property {Array<ImageContainer>} images
                ,	images: imagelist || []
                //@property {ImageContainer} firstImage
                ,	firstImage: imagelist[0] || {}
                // @property {Boolean} showImages
                ,	showImages: imagelist.length > 0
                // @property {Boolean} showImageSlider
                ,	showImageSlider: imagelist.length > 1
            };
            // @class ProductDetails.ImageGallery.View
        }
    })
});
