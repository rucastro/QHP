/**
 * @NApiVersion 2.0
 * @NScriptName EF - SMH | Hashtag Service
 * @NScriptId _hashtag_service
 * @NModuleScope Public
 * @NScriptType Suitelet
 */
define([
    'N/http',
    './../libraries/Hashtag.Model'
], function HashtagService(
    http,
    Model
) {
    'use strict';

    return {
        onRequest: function onRequest(context) {
            // context.response.setHeader('Content-Type', 'application/json; charset=UTF-8');

            switch (context.request.method) {
            case http.Method.GET:
                context.response.write(
                    JSON.stringify(
                        Model.searchByHashtag(context.request.parameters.hashtag || '')
                    )
                );
                break;
            default:
                break;
            }
        }
    };
});
