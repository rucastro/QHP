define('Facets.Browse.View.InfiniteScroll', [
    'SC.Configuration',

    'Backbone',
    'Backbone.CollectionView',

    'Facets.Browse.View',
    'Facets.ItemCell.View',
    'GlobalViews.Pagination.View',

    'InfiniteScroll.Model',
    'Facets.Model',
    'Facets.Helper',

    'facets_items_collection.tpl',
    'facets_items_collection_view_cell.tpl',
    'facets_items_collection_view_row.tpl',
    'infinite_scroll_next_view.tpl',

    'jQuery',
    'underscore',
    'Utils'

], function FacetsBrowseViewInfiniteScroll(
    Configuration,

    Backbone,
    BackboneCollectionView,

    FacetsBrowseView,
    FacetsItemCellView,
    GlobalViewsPaginationView,

    InfiniteScrollModel,
    FacetsModel,
    FacetsHelper,

    facetsItemsCollectionTpl,
    facetsItemsCollectionViewCellTpl,
    facetsItemsCollectionViewRowTpl,
    infiniteScrollNextViewTpl,

    jQuery,
    _
) {
    'use strict';

    var infiniteScrollConfig = Configuration.get('infiniteScroll');

    if (infiniteScrollConfig.enabled) {
        _.extend(FacetsBrowseView.prototype, {
            infiniteScrollModel: null,

            events: _.extend(FacetsBrowseView.prototype.events, {
                'click [data-action="load-previous"]': 'loadPreviousPage',
                'click [data-action="load-next"]': 'loadNext',
                'click [data-action="scroll-to-top"]': 'scrollToTop'
            }),

            childViews: _.extend(FacetsBrowseView.prototype.childViews, {
                'GlobalViews.Pagination': function GlobalViewsPagination() {
                    var translator = this.translator;
                    var view = new GlobalViewsPaginationView({
                        currentPage: translator.getOptionValue('page'),
                        totalPages: this.totalPages,
                        template: infiniteScrollNextViewTpl,
                        pager: function pager(page) {
                            return translator.cloneForOption('page', page).getUrl();
                        }
                    });

                    // TODO view.template assignment remove
                    view.template = infiniteScrollNextViewTpl;
                    return view;
                }
            }),

            getModuleConfig: function getModuleConfig() {
                return infiniteScrollConfig;
            },

            // Scroll to Top button
            scrollToTop: function scrollToTop() {
                jQuery('html, body').animate({
                    scrollTop: 0
                }, 700);
                return false;
            },

            wrapInitialItemsLoaded: function wrapInitLoadedItems() {
                var pageNumber = this.infiniteScrollModel.get('currentPageNumber');
                if (this.$('[data-view="Facets.Items"]').length === 1) {
                    this.$('[data-view="Facets.Items"]')
                        .wrapInner('' +
                            '<div ' +
                            'id="infinite-scroll-facet-items' + pageNumber + '"' +
                            'class="infinite-scroll-facet-items" ' +
                            'data-pageId="' + pageNumber + '">' +
                            '</div>');

                    this.infiniteScrollModel
                        .set('pageBlockHeight', parseFloat(this.$('#infinite-scroll-facet-items' + pageNumber).height()));

                    if (this.infiniteScrollModel.get('pageBlockHeight') !== 0) {
                        this.infiniteScrollModel.computeNextScrollPoint({
                            pageOffset: this.$('#infinite-scroll-facet-items' + pageNumber).offset(),
                            pageNumber: pageNumber
                        });
                    }

                    this.infiniteScrollModel.updatePageScrollPoints({
                        pageOffset: this.$('#infinite-scroll-facet-items' + pageNumber).offset(),
                        pageNumber: pageNumber
                    });
                }
            },

            loadPage: function loadPage(options) {
                var self = this;
                var facetsModel = new FacetsModel();
                var translator = this.translator.cloneForOption('page', (options.pageNumber));
                var facetMainContainer;
                var itemsContainer;

                if (this.$('#infinite-scroll-facet-items' + options.pageNumber).length === 0) {
                    facetMainContainer = this.$('[data-view="Facets.Items"]');
                    itemsContainer = '<div id="infinite-scroll-facet-items' + options.pageNumber + '" ' +
                        'class="infinite-scroll-facet-items" data-pageId="' + options.pageNumber + '"></div>';

                    if (options.isLoadedAtTop) {
                        facetMainContainer.prepend(itemsContainer);
                    } else {
                        facetMainContainer.append(itemsContainer);
                    }
                }

                if (_.where(this.loadedPages, { pageNumber: options.pageNumber }).length === 0) {
                    if (options.isLoadedAtTop) {
                        this.$el.find('.infinite-scroll-button-wrapper-prev').remove();
                        this.$el
                            .find('[data-view="Facets.FacetsDisplay"]')
                            .before('<div class="infinite-scroll-button-wrapper-prev">Loading Page ' + options.pageNumber + '...</div>');
                    } else {
                        this.$el.find('.infinite-scroll-button-wrapper').html('');
                        this.$el.find('.infinite-scroll-button-wrapper').html('Loading Page ' + options.pageNumber + '...');
                    }

                    facetsModel.fetch({
                        data: translator.getApiParams()
                    }).success(function success() {
                        var displayOption = _.find(Configuration.itemsDisplayOptions, function find(option) {
                            return option.id === translator.getOptionValue('display');
                        });

                        var ItemCollectionView = new BackboneCollectionView({
                            el: jQuery('#infinite-scroll-facet-items' + options.pageNumber),
                            childTemplate: displayOption.template,
                            childView: FacetsItemCellView,
                            viewsPerRow: parseInt(displayOption.columns, 10),
                            collection: facetsModel.get('items'),
                            cellTemplate: facetsItemsCollectionViewCellTpl,
                            rowTemplate: facetsItemsCollectionViewRowTpl,
                            template: facetsItemsCollectionTpl,
                            context: {
                                keywords: translator.getOptionValue('keywords')
                            }
                        });

                        if (!facetsModel.get('items').models.length) {
                            self.$el.find('.infinite-scroll-button-wrapper').html('');
                            return;
                        }

                        ItemCollectionView.render();

                        if (options.isLoadedAtTop) {
                            self.updateAllScrollPoints();
                            if (parseInt(options.pageNumber, 10) === 1) {
                                self.$el.find('.infinite-scroll-button-wrapper-prev').remove();
                            } else {
                                self.addButtonPrevious(options.pageNumber - 1);
                            }
                        } else {
                            if (parseInt(options.pageNumber, 10) === self.totalPages) {
                                self.$el.find('.infinite-scroll-button-wrapper').remove();
                            }

                            self.infiniteScrollModel.updatePageScrollPoints({
                                pageOffset: self.$('#infinite-scroll-facet-items' + options.pageNumber).offset(),
                                pageHeight: self.$('#infinite-scroll-facet-items' + options.pageNumber).height(),
                                pageNumber: options.pageNumber
                            });

                            if (options.loadNum < self.getModuleConfig().pageLoadLimit) {
                                self.loadPage({
                                    pageNumber: options.pageNumber + 1,
                                    isLoadedAtTop: false,
                                    loadNum: options.loadNum + 1
                                });
                            } else if (options.loadNum === self.getModuleConfig().pageLoadLimit) {
                                self.infiniteScrollModel.set('readyLoad', true);
                                self.infiniteScrollModel.computeNextScrollPoint({
                                    pageOffset: self.$('#infinite-scroll-facet-items' + options.pageNumber).offset(),
                                    pageNumber: options.pageNumber
                                });
                            }
                        }

                        self.model.get('items').models = _.uniq(
                            _.union(self.model.get('items').models, facetsModel.get('items').models), false, _.property('id'));
                    });
                }
            },

            updateAllScrollPoints: function updateAllScrollPoints() {
                var self = this;
                this.infiniteScrollModel.set('loadedPages', []);

                this.$('[data-view="Facets.Items"]').find('.infinite-scroll-facet-items').each(function updateFacets() {
                    var pageNumber = self.$(this).attr('data-pageid');
                    self.infiniteScrollModel.updatePageScrollPoints({
                        pageOffset: self.$('#infinite-scroll-facet-items' + pageNumber).offset(),
                        pageHeight: self.$('#infinite-scroll-facet-items' + pageNumber).height(),
                        pageNumber: pageNumber
                    });
                });
            },

            loadPreviousPage: function loadPreviousPage(event) {
                var $target = jQuery(event.target);

                this.loadPage({
                    pageNumber: $target.attr('data-pageid'),
                    isLoadedAtTop: true
                });

                return false;
            },

            addButtonPrevious: function loadPreviousButton(pageNumber) {
                var translatorPrevPage = this.translator.cloneForOption('page', pageNumber);

                this.$el.find('.infinite-scroll-button-wrapper-prev').remove();
                this.$el
                    .find('[data-view="Facets.FacetsDisplay"]')
                    .before('<div class="infinite-scroll-button-wrapper-prev"><a href="' + translatorPrevPage.getUrl() +
                        '" class="infinite-scroll-previous-button" data-action="load-previous" data-pageId="' + (pageNumber) + '">' +
                        _.translate('Load Previous') + '</a></div>');
            },

            initialize: _.wrap(FacetsBrowseView.prototype.initialize, function wrappedInitialize(fn) {
                var self = this;
                var amountScrolled;
                var currentPage;
                var translator;
                var nextScrollPagePoint;
                var currentPageNumber;

                fn.apply(this, _.toArray(arguments).slice(1));

                this.on('afterCompositeViewRender', function afterCompositeViewRender() {
                    self.$el
                        .find('.facets-facet-browse-results')
                        .attr('data-totalPages', self.totalPages)
                        .before('<a class="infinite-scroll-top" data-action="scroll-to-top">' +
                            '<i class="infinite-scroll-top-icon"></i>' +
                            '</a>'
                        );

                    currentPageNumber = this.translator.getOptionValue('page');

                    self.infiniteScrollModel = new InfiniteScrollModel({
                        configuration: this.getModuleConfig()
                    });
                    self.infiniteScrollModel.set('currentPageNumber', currentPageNumber);

                    if (currentPageNumber > 1) {
                        self.addButtonPrevious(currentPageNumber - 1);
                    }

                    self.wrapInitialItemsLoaded();
                    jQuery(window).unbind('scroll');

                    // window.scroll start
                    jQuery(window).bind('scroll', function windowScroll() {
                        if (self.options.application.getLayout().currentView instanceof FacetsBrowseView) {
                            nextScrollPagePoint = self.infiniteScrollModel.get('nextScrollPagePoint');

                            if (nextScrollPagePoint.pageNumber === 0) {
                                self.wrapInitialItemsLoaded();
                            }

                            amountScrolled = window.pageYOffset;

                            // URL Update
                            currentPage = _.filter(self.infiniteScrollModel.get('loadedPages'), function checkCurrentPage(loadedPage) {
                                return (amountScrolled >= loadedPage.scrollStartPoint &&
                                amountScrolled < loadedPage.scrollEndpoint);
                            });

                            if (currentPage[0] && currentPage[0].pageNumber !== self.infiniteScrollModel.get('currentPageNumber')) {
                                self.infiniteScrollModel.set('currentPageNumber', currentPage[0].pageNumber);
                                translator = self.translator.cloneForOption('page', currentPage[0].pageNumber);
                                Backbone.history.navigate(translator.getUrl(), {
                                    trigger: false,
                                    replace: true
                                });
                            }

                            // Load Pages
                            if (amountScrolled >= nextScrollPagePoint.start &&
                                amountScrolled <= nextScrollPagePoint.end &&
                                (!nextScrollPagePoint.hasLoaded) &&
                                self.infiniteScrollModel.get('readyLoad')
                            ) {
                                self.infiniteScrollModel.set('readyLoad', false);
                                self.loadPage({
                                    pageNumber: nextScrollPagePoint.pageNumber,
                                    isLoadedAtTop: false,
                                    loadNum: 1
                                });
                            }


                            if (amountScrolled > 1500) {
                                self.$('.infinite-scroll-top').fadeIn('slow');
                            } else {
                                self.$('.infinite-scroll-top').fadeOut('slow');
                            }
                        }
                    });
                });
            })
        });
    }
});
