define('ItemDetails.View.LookItems', [
    'Backbone.CollectionView',
    'ItemDetails.View.LookItem',
    'ItemDetails.Collection.LookItems',
    'SC.Configuration',
    'Tracker',

    'itemdetails_lookitems.tpl',
    'itemdetails_lookitems_row.tpl',
    'itemdetails_lookitems_cell.tpl',

    'jQuery',
    'Backbone',
    'underscore',
    'Utils'
], function ItemDetailsViewLookItems(
    BackboneCollectionView,
    LookItemView,
    Collection,
    Configuration,
    Tracker,

    ItemDetailsLookItemsTpl,
    ItemDetailsLookItemsRowTpl,
    ItemDetailsLookItemsCellTpl,

    jQuery,
    Backbone,
    _
) {
    'use strict';

    return BackboneCollectionView.extend({

        initialize: function initialize() {
            var self = this;
            this.collection = new Collection();
            BackboneCollectionView.prototype.initialize.call(this, {
                collection: this.collection,
                viewsPerRow: Infinity,
                cellTemplate: ItemDetailsLookItemsCellTpl,
                rowTemplate: ItemDetailsLookItemsRowTpl,
                childView: LookItemView,
                template: ItemDetailsLookItemsTpl
            });

            this.listenToOnce(this.options.application.getLayout(), 'afterAppendView', function afterAppendView() {
                self.collection.fetch({
                    data: {
                        itemID: this.model.get('_id')
                    }
                }).done(function onDone() {
                    var carousel;
                    var imgMinHeight;
                    var thumbnailSize;
                    var application = self.options.application;
                    self.render();

                    if (self.collection.length) {
                        carousel = self.$('[data-type="carousel-look-items"]');
                        if (_.isPhoneDevice() === false && application.getConfig('siteSettings.imagesizes')) {
                            thumbnailSize = _.where(
                                application.getConfig('siteSettings.imagesizes'), {
                                    name: application.getConfig('imageSizeMapping.thumbnail')
                                }
                            );

                            imgMinHeight = thumbnailSize && thumbnailSize[0].maxheight;

                            carousel
                                .find('.look-item-link-image')
                                .css('minHeight', imgMinHeight);
                        }

                        _.initBxSlider(carousel, Configuration.bxSliderDefaults);
                    }
                });
            });
        },
        getContext: function getContext() {
            return {
                name: this.model.get('_name'),
                showCells: !!this.collection.length
            };
        }
    });
});
