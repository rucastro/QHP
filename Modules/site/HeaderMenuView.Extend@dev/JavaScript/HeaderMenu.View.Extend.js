define('HeaderMenu.View.Extend', [
    'Header.Menu.View',
    'underscore',
    'jQuery'
], function HeaderMenuViewExtend(
    HeaderMenuView,
    _
) {
    'use strict';

    _.extend(HeaderMenuView.prototype, {
        render: _.wrap(HeaderMenuView.prototype.render, function render(fn) {
            fn.apply(this, _.toArray(arguments).slice(1));
            this.$('ul.header-menu-level2 li:nth-child(5n + 5)').after('<div class="clearfix"></div>');

            $(window).on('resize', function (){
                var win = $(this); //this = window
                if (win.width() <= 1024) {
                    console.log("width ->",win.width());
                    $('.header-menu-secondary-nav ul li .header-menu-level1-anchor').attr('data-toggle', 'dropdown');
                }
                else {
                    $('.header-menu-secondary-nav ul li .header-menu-level1-anchor').removeAttr('data-toggle');
                }
            }).resize();
        })
    });
});
