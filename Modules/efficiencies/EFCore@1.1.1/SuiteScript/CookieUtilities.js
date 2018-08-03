define('CookieUtilities', [

], function CookieUtilities(

) {
    'use strict';

    return {
        /**
         *
         * @param {String} Cookie key
         * @param {Boolean} is JSON
         * @returns {String} cookieValue
         */
        readCookie: function readCookie(key, isJSON) {
            var result;
            var cookieHeader = request.getHeader('Cookie');
            result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(cookieHeader);


            result = (result && result[1] && decodeURIComponent(result[1])) || null;
            if (isJSON && result) {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    result = null;
                }
            }

            return result;
        }
    };
});

