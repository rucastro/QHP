define('HashtagGallery.ItemDetails.View', [
    'HashtagGallery.Collection',
    'SC.Shopping.Configuration',
    'HashtagGallery.Post.View',
    'HashtagGallery.Pagination.View',
    'Backbone',
    'Backbone.CompositeView',
    'Backbone.CollectionView',
    'underscore',

    'hashtag_gallery_item_details.tpl',
    'hashtag_gallery_item_row.tpl',
    'hashtag_gallery_item_cell.tpl',

    'Utils',
    'jQuery'

], function HashtagGalleryItemDetailsView(
    Collection,
    Configuration,
    PostView,
    PaginationView,

    Backbone,
    BackboneCompositeView,
    BackboneCollectionView,
    _,

    hashtagGalleryItemDetailsTpl,
    hashtagGalleryItemRowTpl,
    hashtagGalleryItemCellTpl,

    Utils // ,
    // jQuery
) {
    'use strict';

    return Backbone.View.extend({
        template: hashtagGalleryItemDetailsTpl,

        initialize: function initialize(options) {
            if (options.hashtags === '&nbsp;') {
                options.hashtags = '';
            }

            this.Configuration = options.application.Configuration.hashtagGallery;

            if (options.hashtags) {
                this.queryOptions = Utils.parseUrlOptions(location.href);
                this.collection = new Collection();

                this.collection.fetch({
                    data: {
                        hashtags: options.hashtags,
                        page: (this.queryOptions && this.queryOptions.hashtagPage) || 1
                    }
                });
                BackboneCompositeView.add(this);
                this.listenTo(this.collection, 'sync', this.renderOn);
            }
        },

        childViews: {
            'Hashtag.Gallery': function HashtagGallery() {
                return new BackboneCollectionView({
                    collection: this.collection,
                    childView: PostView,
                    viewsPerRow: 4,
                    rowTemplate: hashtagGalleryItemRowTpl,
                    cellTemplate: hashtagGalleryItemCellTpl,
                    childViewOptions: {
                        application: this.options.application
                    }
                });
            },
            'GlobalViews.Pagination': function GlobalViewsPagination() {
                return new PaginationView(_.extend({
                    currentPage: this.collection.page || 0,
                    totalPages: this.collection.totalPages || 0,
                    pager: function pager(page) {
                        return '/' + (page > 1 ?
                                _.setUrlParameter(Backbone.history.fragment, 'hashtagPage', page) :
                                _.removeUrlParameter(Backbone.history.fragment, 'hashtagPage'));
                    },
                    extraClass: 'pull-right no-margin-top no-margin-bottom'
                }, Configuration.get('defaultPaginationSettings')));
            }
        },
        renderOn: function renderOn() {
            this.render();
        },
        getContext: function getContext() {
            var hashtags = _.map(this.collection && this.collection.hashtags, function map(h) {
                return '#' + h;
            }).join(', ');
            return {
                hasHashtag: (hashtags && hashtags.length) &&
                (this.collection && this.collection.totalRecordsFound >= this.Configuration.minimumToDisplayModule),
                hashtag: hashtags,
                total: (this.collection && this.collection.size()) || 0
            };
        }
    });
});
