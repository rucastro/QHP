define('QS.SiteSearch.View', [
    'SiteSearch.View',
    'Header.View',
    'underscore',
    'jQuery',
    'Utils',
    'SC.Configuration'
], function QSSiteSearchView(
    SiteSearchView,
    HeaderView,
    _,
    jQuery,
    Utils,
    Configuration
) {
    'use strict';

    SiteSearchView.prototype.initialize = _.wrap(SiteSearchView.prototype.initialize, function initialize(fn) {
        fn.apply(this, _.toArray(arguments).slice(1));
        this.on('afterViewRender', function afterViewRender(view) {
            var isFixedHeader = Configuration.header.fixedHeader;

            if (isFixedHeader) {
                if (Utils.isDesktopDevice()) {
                    _.defer(function defer() {
                        var browserHeight = jQuery(window).height();
                        var siteHeaderHeight = view.parentView.$el.height();
                        var siteSearchHeight = view.$el.height();
                        var calcHeight = (browserHeight - siteHeaderHeight - siteSearchHeight) + 'px';

                        view.$el.find('.tt-dropdown-menu').css({
                            maxHeight: calcHeight,
                            overflowY: 'auto'
                        });

                        jQuery(window).resize(function resize() {
                            browserHeight = jQuery(window).height();
                            siteHeaderHeight = view.parentView.$el.height();
                            calcHeight = (browserHeight - siteHeaderHeight) + 'px';

                            view.$el.find('.tt-dropdown-menu').css({
                                maxHeight: calcHeight,
                                overflowY: 'auto'
                            });
                        });
                    });
                }
            }
        });
    });
});
