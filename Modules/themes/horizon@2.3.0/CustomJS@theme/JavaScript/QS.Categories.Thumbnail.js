define('QS.Categories.Thumbnail', [
    'Categories',
    'underscore'
], function CategoriesThumbnail(
    Categories,
    _
) {
    'use strict';

    _.extend(Categories, {
        /* eslint-disable */
        makeNavigationTab: function categories(categories) {
            var result = [];
            var self = this;

            _.each(categories, function eachCategory(category) {
                var href = category.fullurl;
                var tab = {
                    'href': href,
                    'text': category.name,
                    'data': {
                        hashtag: '#' + href,
                        touchpoint: 'home'
                    },
                    'class': 'header-menu-level' + category.level + '-anchor',
                    'data-type': 'commercecategory',
                    'thumbnailurl': category.thumbnailurl
                };

                if (category.categories) {
                    tab.categories = self.makeNavigationTab(category.categories);
                }

                result.push(tab);
            });

            return result;
        }
        /* eslint-enable */
    });
});
