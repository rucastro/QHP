/**
 * @NApiVersion 2.0
 * @NScriptName EF - SMH | Hashtag Model
 * @NScriptId _hashtag_model
 * @NModuleScope Public
 */
define([
    'N/search'
], function HashtagModel(
    search
) {
    'use strict';

    var recordType = 'customrecord_ef_social_media_hashtag';
    return {
        searchByHashtag: function searchByHashtag(hashtag) {
            var mappedResults = [];
            var filters = [];

            if (hashtag) {
                filters = [
                    search.createFilter({
                        name: 'name',
                        operator: search.Operator.STARTSWITH,
                        values: hashtag
                    })
                ];
            }

            search.create({
                type: recordType,
                columns: [
                    'internalid',
                    search.createColumn({
                        name: 'name',
                        sort: search.Sort.ASC
                    })
                ],
                filters: filters
            }).run().each(function each(result) {
                mappedResults.push({
                    internalid: result.getValue('internalid'),
                    name: result.getValue('name')
                });
                return true;
            });

            return {
                results: mappedResults
            };
        }
    };
});
