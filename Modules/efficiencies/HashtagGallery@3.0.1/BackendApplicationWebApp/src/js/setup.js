(function starter(Application, jQuery, _, Backbone) { // eslint-disable-line

    'use strict';

    jQuery(function jQueryReady() {
        // loading icon sizes, used for positioning math
        var iconHeight = 16;
        var iconWidth = 16;
        var mousePosition = {
            top: 0,
            left: 0
        };

        var $body = jQuery(window.document.body);
        var $loadingIcon = jQuery('#loadingIndicator');

        Application.mainContainer = jQuery('#main');
        Application.leftContainer = jQuery('#left');
        Application.routers = [];


        _.each(Application.Modules, function each(module) {
            if (module.Router) {
                Application.routers.push(new module.Router());
            }
            if (module.mountToApp) {
                module.mountToApp();
            }
        });

        // Workaround while suitescript issue
        jQuery.ajaxSetup({
            dataType: 'json'
        });

        if (!$loadingIcon.length) {
            // if the icon wasn't there, lets add it and make a reference in the global scope
            $loadingIcon = jQuery('<img/>', {
                id: 'loadingIndicator',
                'class': 'global-loading-indicator',
                src: window.ENVIRONMENT.ASSETS_PATH + 'img/ajax-loader.gif',
                css: {
                    zIndex: 9999,
                    position: 'absolute'
                }
            }).hide();
            $loadingIcon.appendTo($body);
        }

        Application.$loadingIndicator = $loadingIcon;


        $body.on({
            // On mouse move, we update the icon's position, even if its not shown
            mousemove: _.throttle(function mousemove(e) {
                mousePosition = {
                    top: Math.min($body.innerHeight() - iconHeight, e.pageY + iconWidth),
                    left: Math.min($body.innerWidth() - iconWidth, e.pageX + iconHeight)
                };

                $loadingIcon.filter(':visible').css(mousePosition);
            }, 50),
            // when the body resizes, we move the icon to the bottom of the page
            // so we don't get some empty white space at the end of the body
            resize: _.throttle(function resize() {
                var iconOffset = $loadingIcon.offset();
                if (!iconOffset) {
                    return;
                }
                mousePosition = {
                    top: Math.min($body.innerHeight() - iconHeight, iconOffset.top),
                    left: Math.min($body.innerWidth() - iconWidth, iconOffset.left)
                };

                $loadingIcon.filter(':visible').css(mousePosition);
            }, 50)
        });

        Application.loadingIndicatorShow = function loadingIndicatorShow() {
            if (Application.$loadingIndicator) {
                Application.$loadingIndicator.css(mousePosition).show();
            }
        };

        Application.loadingIndicatorHide = function loadingIndicatorHide() {
            if (Application.$loadingIndicator) {
                Application.$loadingIndicator.hide();
            }
        };

        // This registers an event listener to any ajax call
        jQuery(document)
            // http://api.jquery.com/ajaxStart/
            .ajaxStart(Application.loadingIndicatorShow)
            // http://api.jquery.com/ajaxStop/
            .ajaxStop(Application.loadingIndicatorHide);

        // Initialize the Backbone router.
        Backbone.history.start({
            pushState: false
        });
    });
})(window.Application, window.jQuery, window._, window.Backbone);
