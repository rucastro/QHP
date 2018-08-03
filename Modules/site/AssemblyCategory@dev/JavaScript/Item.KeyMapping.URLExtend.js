define('Item.KeyMapping.URLExtend', [
    'Item.KeyMapping',
    'Utils',
    'underscore'
], function ItemKeyMappingURLExtend(
    ItemKeyMapping,
    Utils,
    _
) {
    'use strict';

    ItemKeyMapping.getKeyMapping = _.wrap(ItemKeyMapping.getKeyMapping, function getKeyMapping(fn) {
        var keyMapping = fn.apply(this, _.toArray(arguments).slice(1));

        _.extend(keyMapping, {
            _url: function (item)
            {
                var itemUrl;
                var matrixParent = item.get('_matrixParent');
                // If this item is a child of a matrix return the URL of the parent
                if (matrixParent && matrixParent.get('internalid'))
                {
                    return item.get('_matrixParent').get('_url');
                }
                // if its a standard version we need to send it to the canonical URL
                else if (SC.ENVIRONMENT.siteType && SC.ENVIRONMENT.siteType === 'STANDARD')
                {
                    return item.get('canonicalurl');
                }
                // Other ways it will use the URL component or a default /product/ID
                if (item.get('custitem_ps_assemblycategorylink') && item.get('custitem_ps_assemblycategorylink') !='')
                    itemUrl = item.get('custitem_ps_assemblycategorylink');
                else
                    itemUrl = item.get('urlcomponent') ? '/'+ item.get('urlcomponent') : '/product/'+ item.get('internalid');

                return itemUrl;
            },
            _thumbnail: function (item)
            {
                var item_images_detail = item.get('itemimages_detail') || {};

                // If you generate a thumbnail position in the itemimages_detail it will be used
                if (item_images_detail.thumbnail)
                {
                    if (_.isArray(item_images_detail.thumbnail.urls) && item_images_detail.thumbnail.urls.length)
                    {
                        return item_images_detail.thumbnail.urls[0];
                    }

                    return item_images_detail.thumbnail;
                }
                // otherwise it will try to use the storedisplaythumbnail
                if (SC.ENVIRONMENT.siteType && SC.ENVIRONMENT.siteType === 'STANDARD' && item.get('storedisplaythumbnail'))
                {
                    return {
                        url: item.get('storedisplaythumbnail')
                        ,	altimagetext: item.get('_name')
                    };
                }
                // No images huh? carry on

                var parent_item = item.get('_matrixParent');
                // If the item is a matrix child, it will return the thumbnail of the parent
                if (parent_item && parent_item.get('internalid'))
                {
                    return parent_item.get('_thumbnail');
                }

                var images = Utils.imageFlatten(item_images_detail);

                images = _.filter(images, function (image) {
                    var imageURL = image.url;
                    if (imageURL.indexOf('_assembly_') !== -1) {
                        var imageURLStart = imageURL.substring(imageURL.indexOf('_assembly_'),imageURL.length);
                        var imageURL_array = imageURLStart.split('_');

                        if (imageURL_array.length > 3) {
                            var img_d = imageURL_array[imageURL_array.length-1];
                            var img_id = img_d.substring(0,img_d.indexOf('.'));
                            if (img_id && img_id == '10') {
                                return false;
                            } else
                            {
                                return true;
                            }

                        }
                        else return true;
                    } else return true;
                });

                // If you using the advance images features it will grab the 1st one
                if (images.length)
                {
                    return images[0];
                }

                // still nothing? image the not available
                return {
                    url:  Utils.getAbsoluteUrlOfNonManagedResources(SC.CONFIGURATION.imageNotAvailable)
                    ,	altimagetext: item.get('_name')
                };
            }
        });

        return keyMapping;
    });
});
