define('Facets.Browse.Extend', [
    'Facets.Browse.View',
    'SC.Configuration',
    'LiveOrder.Model',
    'Facets.Helper',
    'Categories',
    'Facets.FacetedNavigation.View',
    'Facets.FacetedNavigationItem.View',
    'Facets.FacetsDisplay.View',
    'Facets.FacetList.View',
    'Facets.ItemListDisplaySelector.View',
    'Facets.ItemListSortSelector.View',
    'Facets.ItemListShowSelector.View',
    'Facets.ItemCell.View',
    'Assembly.ItemCell.View',
    'Facets.Empty.View',
    'Facets.Browse.CategoryHeading.View',
    'Facets.CategoryCell.View',
    'Facets.FacetedNavigationItemCategory.View',
    'GlobalViews.Pagination.View',
    'Tracker',

    'Utilities.ResizeImage',

    'facets_items_collection.tpl',
    'facets_items_collection_view_cell.tpl',
    'facets_items_collection_view_row.tpl',

    'assembly_item_cell.tpl',
    'assembly_facet_browse.tpl',
    'assembly_items_collection.tpl',
    'assembly_items_collection_view_cell.tpl',
    'assembly_items_collection_view_row.tpl',

    'Backbone.CollectionView',
    'underscore',
    'jquery.zoom'
], function FacetsBrowseExtend(
    FacetsBrowseView,
    Configuration,
    LiveOrderModel,
    Helper,
    Categories,
    FacetsFacetedNavigationView,
    FacetsFacetedNavigationItemView,
    FacetsFacetsDisplayView,
    FacetsFacetListView,
    FacetsItemListDisplaySelectorView,
    FacetsItemListSortSelectorView,
    FacetsItemListShowSelectorView,
    FacetsItemCellView,
    AssemblyItemCellView,
    FacetsEmptyView,
    FacetsBrowseCategoryHeadingView,
    FacetsCategoryCellView,
    FacetsFacetedNavigationItemCategoryView,
    GlobalViewsPaginationView,
    Tracker,

    resizeImage,

    facets_items_collection_tpl,
    facets_items_collection_view_cell_tpl,
    facets_items_collection_view_row_tpl,

    assembly_item_cell_tpl,
    assembly_facet_browse_tpl,
    assembly_items_collection_tpl,
    assembly_items_collection_view_cell_tpl,
    assembly_items_collection_view_row_tpl,
    BackboneCollectionView,
    _
) {
    'use strict';

    _.extend(FacetsBrowseView.prototype, {
        preloadimages: [],
        isAssembly: false,
        extendEvents: {
            'mouseover .assembly-item-cell-list': 'changeMainImage'
        },
        initialize: _.wrap(FacetsBrowseView.prototype.initialize, function initialize(fn) {
            fn.apply(this, _.toArray(arguments).slice(1));

           // has_categories = !!(this.category && this.category.categories)
            this.category = this.model.get('category') ? this.model.get('category') : {};
            if (typeof this.category.get=== 'function')
            if (this.category.get('addtohead') === 'as-group') {
                this.isAssembly = true;
                this.template = assembly_facet_browse_tpl;
                _.extend(this.events, this.extendEvents);
            }
            else { this.isAssembly = false; }


        }),

        childViews: {
            'Facets.FacetedNavigation': function (options) {
                var exclude = _.map((options.excludeFacets || '').split(','),
                    function (facet_id_to_exclude) {
                        return jQuery.trim( facet_id_to_exclude );
                    });
                var hasCategories = !!(this.category && this.category.categories);
                var	hasItems = this.model.get('items').length;
                var	hasFacets = hasItems && this.model.get('facets').length;
                var	appliedFacets = this.translator.cloneWithoutFacetId('category').facets;
                var	hasAppliedFacets = appliedFacets.length;

            return new FacetsFacetedNavigationView({
                categoryItemId: this.category && this.category.itemid,
                clearAllFacetsLink: this.translator.cloneWithoutFacets().getUrl(),
                hasCategories: hasCategories,
                hasItems: hasItems,
                hasFacets: hasFacets,
                hasCategoriesAndFacets: hasCategories && hasFacets,
                appliedFacets: appliedFacets,
                hasFacetsOrAppliedFacets: hasFacets || hasAppliedFacets,
                translator: this.translator,
                facets: _.filter(this.model.get('facets'), function (facet) {
                        return !_.contains(exclude, facet.id);
                    }),
                totalProducts: this.model.get('total'),
                keywords: this.translator.getOptionValue('keywords')
            });
        },
            'Facets.FacetsDisplay': function() {
            var facets = this.translator.cloneWithoutFacetId('category').getAllFacets().sort(function (a, b) {
                return b.config.priority - a.config.priority;
            });

            return new FacetsFacetsDisplayView({
                facets: facets
                ,	translator: this.translator
            });
        },
            'Facets.ItemListDisplaySelector': function() {
            return new FacetsItemListDisplaySelectorView({
                configClasses: 'pull-right'
                ,	options: this.options.application.getConfig('itemsDisplayOptions')
                ,	translator: this.translator
            });
            },
            'Facets.ItemListSortSelector': function() {
            return new FacetsItemListSortSelectorView({
                options: this.options.application.getConfig('sortOptions')
                ,	translator: this.translator
            });
            },
            'Facets.ItemListShowSelector': function() {
            return new FacetsItemListShowSelectorView({
                options: this.options.application.getConfig('resultsPerPage')
                ,	translator: this.translator
            });
        },
            'Facets.FacetedNavigation.Item': function (options) {
            var facet_config = this.translator.getFacetConfig(options.facetId)
                ,	contructor_options = {
                model: new Backbone.Model(_.findWhere(this.model.get('facets'), {id: options.facetId}))
                ,	translator: this.translator
            };

            if (facet_config.template)
            {
                contructor_options.template = facet_config.template;
            }

            return new FacetsFacetedNavigationItemView(contructor_options);
        },
            'Facets.Items': function FacetsItem() {
                var self = this;
                var display_option = _.find(this.options.application.getConfig('itemsDisplayOptions'), function (option) {
                    return option.id === self.options.translator.getOptionValue('display');
                });



                if (this.isAssembly) {
                    this.model.get('items').each(function(item) {

                        //if (typeof self.category !== 'undefined' && typeof self.category.get('internalid') === 'function' )
                            item.set('categoryID', self.category.get('internalid'));
                    });


                    var categoryID = this.category.get('internalid');
                    var collection = this.model.get('items');
                    var self = this;
                    var itemSet;
                    var itemCellClass = true;

                    collection.each(function(item) {
                        var imageDetails = item.getImages();
                        var internalID = item.get('internalid');

                        _.each(imageDetails, function (imageDetail) {
                            var imageURL = imageDetail.url;

                            if (imageURL.indexOf('_assembly_') !== -1) {
                                var imageURLStart = imageURL.substring(imageURL.indexOf('_assembly_'),imageURL.length);
                                var imageURL_array = imageURLStart.split('_');
                                if (imageURL_array[2] == categoryID)
                                {
                                    imageDetail.internalid = internalID;
                                    imageDetail.preloadImage = new Image();
                                    imageDetail.preloadImage.src = imageDetail.url;
                                    self.preloadImages(imageDetail);
                                    item.set('itemCellID', imageURL_array[3]);
                                    item.itemCellID = imageURL_array[3];
                                }
                            }
                        });

                    });

                    //console.log('collection', collection);


                    collection.sortBy(function(item) { return item.itemCellID })
                    collection.each(function(item) {
                        if (itemSet != item.itemCellID) {
                            itemSet = item.itemCellID
                            itemCellClass = !itemCellClass;
                        }

                        item.classDiff = itemCellClass;
                    });

                    return new BackboneCollectionView({
                        childTemplate: assembly_item_cell_tpl,
                        childView: AssemblyItemCellView,
                        childViewOptions: {
                            application: this.application
                        },
                        viewsPerRow: parseInt(display_option.columns, 10),
                        collection: this.model.get('items'),
                        cellTemplate: assembly_items_collection_view_cell_tpl,
                        rowTemplate: assembly_items_collection_view_row_tpl,
                        template: assembly_items_collection_tpl,
                        context: {
                            keywords: this.translator.getOptionValue('keywords')
                        }
                    });
                }
                return new BackboneCollectionView({
                    childTemplate: display_option.template,
                    childView: FacetsItemCellView,
                    childViewOptions: {
                        application: this.application
                    },
                    viewsPerRow: parseInt(display_option.columns, 10),
                    collection: this.model.get('items'),
                    cellTemplate: facets_items_collection_view_cell_tpl,
                    rowTemplate: facets_items_collection_view_row_tpl,
                    template: facets_items_collection_tpl,
                    context: {
                        keywords: this.translator.getOptionValue('keywords'),

                    }
                });
            },
            'Facets.Items.Empty': function() {
                return new FacetsEmptyView({
                    keywords: this.translator.getOptionValue('keywords')
                });
            },
            'GlobalViews.Pagination': function() {
            var translator = this.translator;

            return new GlobalViewsPaginationView(_.extend({
                currentPage: translator.getOptionValue('page')
                ,	totalPages: this.totalPages
                ,	pager: function (page) {
                    return translator.cloneForOption('page', page).getUrl();
                }
            }, Configuration.defaultPaginationSettings));
        },
            'Facets.Browse.CategoryHeading': function() {
            return new FacetsBrowseCategoryHeadingView({
                model: this.model.get('category')
            });
        },
            'Facets.CategoryCells': function() {
                return new BackboneCollectionView({
                    childView: FacetsCategoryCellView,
                    collection: this.model.get('category') ? this.model.get('category').get('categories') : []
                });
            },
            'Facets.CategorySidebar': function() {
                return new FacetsFacetedNavigationItemCategoryView({
                    model: this.model.get('category'),
                    categoryUrl: this.translator.getCategoryUrl()
                });
            }
        },

        render: _.wrap(FacetsBrowseView.prototype.render, function render(fn) {
           fn.apply(this, _.toArray(arguments).slice(1));
                if (this.isAssembly) {
                    if (!(this.$.browser == "msie" && this.$.browser.version < 7)) {
                        var target = ".facets-assembly-image-container", top = this.$(target).offset().top - parseFloat(this.$(target).css("margin-top").replace(/auto/, 0));
                        if (this.$(target))
                        $(window).scroll(function (event) {
                            if (this.$(target).offset().top <= this.$(this).scrollTop()) {
                                this.$(target).addClass("float");
                            } else {
                                this.$(target).removeClass("float");
                            }
                        });
                    }
                }
        }),
        preloadImages: function preload(img) {
            this.preloadimages.push(img);
        },

        initZoom: function ()
        {
            if (!SC.ENVIRONMENT.isTouchEnabled)
            {
                var images = this.images
                    ,	self = this;

                this.$('[data-zoom]').each(function (slide_index)
                {
                    self.$(this).zoom({
                        url: resizeImage(images[slide_index].url, 'zoom')
                        ,	callback: function()
                        {
                            var $this = self.$(this);

                            if ($this.width() <= $this.closest('[data-view="Product.ImageGallery"]').width())
                            {
                                $this.remove();
                            }

                            return this;
                        }
                    });
                });
            }
        },

        changeMainImage: function changeMainImage(e) {
            var selectedRow = this.$(e.target).parents('.assembly-item-cell-list')
            var internalID = selectedRow.data('item-id');
            var imageSelected = _.findWhere(this.preloadimages, { internalid: internalID });
            this.$('.assembly-item-cell-list').removeClass('selected');
            if (imageSelected) {

            this.$('.facets-assembly-image-container img').attr('src', imageSelected.url);
            }
            else
                this.$('.facets-assembly-image-container img').attr('src', this.model.get('category').get('pagebannerurl'));

            selectedRow.addClass('selected');

        },
        getContext: _.wrap(FacetsBrowseView.prototype.getContext, function getContext(fn) {

            var content = fn.apply(this, _.toArray(arguments).slice(1));
            if (this.isAssembly) {
                content.category_image = this.model.get('category').get('pagebannerurl');
                content.category_name = this.model.get('category').get('name');
                content.showMainHeader = !this.model.get('items').first().get('custitem_sca_assemblytableheading')
            }
            return content;
        })
    });
});
