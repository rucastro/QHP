define('ProductDetails.Base.View.MetaTagsFix', [
    'underscore',
    'jQuery',
    'ProductDetails.Base.View'
], function ProductDetailsBaseViewMetaTagsFix(
    _,
    jQuery,
    ProductDetailsBaseView
) {
    'use strict';

    _(ProductDetailsBaseView.prototype).extend({

        /* eslint-disable */
        getMetaTags: function getMetaTags ()
        {
            return jQuery('<head/>').html(
                jQuery.trim(
                    this.model.get('item').get('_metaTags')
                )
            ).children('meta');
        }
        /* eslint-enable */

    });
});
