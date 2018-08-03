define('LookBook.Model', [
    'Look.Model',
    'SC.Model', // Base class from which every model inherits
    'SearchHelper', // Class coded by PS Efficiencies to do easy searches
    'underscore' // Third party Utility class, documentation found on underscorejs.org
], function LookBookModel(
    Look,
    SCModel,
    SearchHelper
) {
    'use strict';

    // create a new Class that inherits from SCModel. SC stands for SuiteCommerce
    return SCModel.extend({

        // Required attribute for any SCModel. Should be the same as the Define name, sans the ".model"
        name: 'LookBook',

        // This is used by the SearchHelper record
        record: 'customrecord_ef_lb_look_book',
        columns: {
            internalid: { fieldName: 'internalid' },
            name: { fieldName: 'name' },
            urlcomponent: { fieldName: 'custrecord_ef_lb_lb_url' },
            shortdesc: { fieldName: 'custrecord_ef_lb_lb_shortdesc' },
            longdesc: { fieldName: 'custrecord_ef_lb_lb_longdesc' },
            align: { fieldName: 'custrecord_ef_lb_lb_rightalign' },
            textcolor: { fieldName: 'custrecord_ef_lb_lb_textcolor' },
            image: { fieldName: 'custrecord_ef_lb_lb_image', type: 'file' },
            title: { fieldName: 'custrecord_ef_lb_lb_title' },
            metadesc: { fieldName: 'custrecord_ef_lb_lb_metadesc' },
            metakeys: { fieldName: 'custrecord_ef_lb_lb_metakeys' }
        },
        filters: [
            // basic filter that every search needs to take care off. Inactive is a native field
            { fieldName: 'isinactive', operator: 'is', value1: 'F' }
        ],
        list: function list() {

        },
        getByUrlComponent: function getByUrlComponent(urlComponent) {
            var search;
            var lookBook;

            if (urlComponent) {
                search = new SearchHelper(
                    this.record,
                    this.filters,
                    this.columns
                );

                // add a filter to search for urlcomponents
                search.addFilter({
                    fieldName: this.columns.urlcomponent.fieldName,
                    operator: 'is',
                    value1: urlComponent
                });

                // run search
                search.search();

                // Search Helper has getResult (for when you are expecting one result) and getResults for lists
                lookBook = search.getResult();

                if (!lookBook) {
                    throw notFoundError;
                }

                lookBook.looks = Look.getByLookBook(lookBook.internalid);
            } else {
                // if no url component, we throw an error
                throw notFoundError;
            }

            return lookBook;
        }
    });
});
