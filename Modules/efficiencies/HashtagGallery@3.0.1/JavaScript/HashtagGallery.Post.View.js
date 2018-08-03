define('HashtagGallery.Post.View', [
    'HashtagGallery.Post.Modal.View',
    'Backbone',
    'hashtag_gallery_post.tpl',
    'hashtag_gallery_post_modal.tpl',
    'underscore',
    'HashtagGallery.Validate.BrokenImages',
    'Utils'
], function HashtagGalleryPostView(
    HashtagGalleryPostModalView,
    Backbone,
    hashtagGalleryPostTpl,
    hashtagGalleryPostModalTpl,
    _
) {
    'use strict';

    return Backbone.View.extend({
        template: hashtagGalleryPostTpl,
        events: {
            'click [data-action="show-modal"]': 'showInModal'
        },

        showInModal: function showInModal() {
            this.hashtagGalleryPostModalView = new HashtagGalleryPostModalView({
                application: this.options.application,
                parentView: this,
                model: this.model
            });
            this.options.application.getLayout().showInModal(this.hashtagGalleryPostModalView);
        },

        getContext: function getContext() {
            return {
                noImage: _.getAbsoluteUrl('img/no_image_available.jpeg'),
                checkImage: this.model.checkImage(),
                username: this.model.get('userName'),
                asset: this.model.get('asset'),
                lowresasset: this.model.get('lowresAsset'),
                link: this.model.get('link'),
                caption: this.model.get('caption'),
                userpic: this.model.get('userPic'),
                displayUser: this.options.application.getConfig('hashtagGallery.displayUser'),
                displayCaption: this.options.application.getConfig('hashtagGallery.displayCaption'),
                dateCreated: this.model.get('createdDate')
            };
        }
    });
});
