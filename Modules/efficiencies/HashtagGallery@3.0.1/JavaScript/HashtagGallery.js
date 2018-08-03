define('HashtagGallery', [
    'underscore',
    'ProductDetails.Full.View',
    'HashtagGallery.ItemDetails.View',
    'PluginContainer',
    'SC.Configuration'
], function HashtagGallery(
    _,
    ProductDetailsFullView,
    HashtagGalleryItemDetails,
    PluginContainer,
    Configuration
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var moduleConfig = Configuration.get('hashtagGallery');
            application.Configuration.hashtagGallery = moduleConfig;

            ProductDetailsFullView.prototype.preRenderPlugins = ProductDetailsFullView.prototype.preRenderPlugins || new PluginContainer();
            ProductDetailsFullView.prototype.preRenderPlugins.install({
                name: 'HashtagGallery',
                priority: 10,
                execute: function execute($el) {
                    $el
                        .find('[data-view="ProductReviews.Center"]')
                        .after('<div data-view="ProductDetails.HashtagGallery"/>');
                }
            });

            ProductDetailsFullView.addChildViews({
                'ProductDetails.HashtagGallery': function wrapperFunction(options) {
                    return function returnHastagItemDetailsGallery() {
                        return new HashtagGalleryItemDetails({
                            application: application,
                            hashtags: options.model.get('item').get('custitem_ef_smh_social_media_hashtag')
                        });
                    };
                }
            });
        }
    };
});
