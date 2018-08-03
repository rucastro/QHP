define('safeParseJSON', [

], function defineSafeParseJSON(

) {
    'use strict';

    /**
     * Function to safely parse json (broken json throws exceptions otherwise)
     * @param {String} jsonString
     * @param {*} defaultReturn
     * @returns {*} parsed JSON as Native Javascript types if succesfully parsed, else
     *              a default value or null
     */
    return function safeParsingJSON(jsonString, defaultReturn) {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            return typeof defaultReturn !== 'undefined' ? defaultReturn : null;
        }
    };
});
