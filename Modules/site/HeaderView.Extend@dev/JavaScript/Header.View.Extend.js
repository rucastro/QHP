define('Header.View.Extend', [
    'Header.View',
    'underscore'
], function HeaderViewExtend(
    HeaderView,
    _
) {
    'use strict';

    _.extend(HeaderView.prototype, {
        hideSiteSearch: function hideSiteSearch() {
            //  Disabled toggle of search
        }
    });
});
