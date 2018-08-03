define('HashtagGallery.Pagination.View', [
    'GlobalViews.Pagination.View',
    'Backbone',
    'underscore',
    'Utils'
], function HashtagGalleryPagination(
    Pagination,
    Backbone,
    _
) {
    'use strict';

    return Pagination.extend({
        _pager: function _pager(urlValue) {
            var pageNumber = parseInt(urlValue, 10);
            var url = Backbone.history.fragment;

            return isNaN(pageNumber) || pageNumber === 1 ?
                _.removeUrlParameter(url, 'hashtagPage') :
                _.setUrlParameter(url, 'hashtagPage', pageNumber);
        },
        _getCurrentPage: function _getCurrentPage() {
            var urlOptions = _.parseUrlOptions(Backbone.history.fragment);
            return this._getPageFromUrl(urlOptions.hashtagPage);
        }
    });
});
