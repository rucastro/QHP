define('InfiniteScroll.Model', [
    'Backbone'
], function InfiniteScrollModel(
    Backbone
) {
    'use strict';

    return Backbone.Model.extend({
        defaults: {
            // {scrollStartPoint, scrollEndpoint, pageNumber}
            loadedPages: [],

            currentPageNumber: 0,

            nextScrollPagePoint: {
                start: 0,
                end: 0,
                pageNumber: 0,
                hasLoaded: true
            },

            pageBlockHeight: 0,

            readyLoad: true
        },

        initialize: function initialize() {
            this.set('loadedPages', []);

            this.set('currentPageNumber', 0);

            this.set('nextScrollPagePoint', {
                start: 0,
                end: 0,
                pageNumber: 0,
                hasLoaded: true
            });

            this.set('pageBlockHeight', 0);

            this.set('readyLoad', true);
        },

        updatePageScrollPoints: function updatePageScrollPoints(pageAttr) {
            var loadedPages = this.get('loadedPages');

            if (pageAttr.pageOffset && this.get('pageBlockHeight') !== 0) {
                loadedPages.push({
                    scrollStartPoint: pageAttr.pageOffset.top,
                    scrollEndpoint: pageAttr.pageOffset.top + this.get('pageBlockHeight'),
                    pageNumber: pageAttr.pageNumber
                });

                this.set('loadedPages', loadedPages);
            }
        },

        computeNextScrollPoint: function computeNextScrollPoint(pageAttr) {
            if (pageAttr.pageOffset) {
                this.set('nextScrollPagePoint', {
                    start: pageAttr.pageOffset.top + this.get('configuration').scrollTrigger,
                    end: pageAttr.pageOffset.top + this.get('configuration').scrollTrigger +
                    (parseInt(this.get('configuration').pageLoadLimit, 10) * this.get('pageBlockHeight')),
                    hasLoaded: false,
                    pageNumber: pageAttr.pageNumber + 1
                });
            }
        }
    });
});
