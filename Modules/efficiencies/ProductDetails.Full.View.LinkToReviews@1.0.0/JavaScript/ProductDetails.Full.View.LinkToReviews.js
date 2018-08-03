define('ProductDetails.Full.View.LinkToReviews', [
    'ProductDetails.Full.View',
    'underscore',
    'jQuery'
], function ProductDetailsLinkToReviews(
    ProductDetailsFullView,
    _,
    jQuery
) {
    'use strict';

    _.extend(ProductDetailsFullView.prototype.events, {
        'click .product-details-full-rating': function clickItemDetailsRatingHeader(event) {
            event.preventDefault();
            jQuery('body').animate({
                scrollTop: this.$('.product-reviews-center-container').offset().top
            }, 'fast');
        }
    });
});
