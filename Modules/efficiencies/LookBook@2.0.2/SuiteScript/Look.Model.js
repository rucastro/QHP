define('Look.Model', [
    'LookItem.Model',
    'SC.Model', // Base class from which every model inherits
    'SearchHelper' // Class coded by PS Efficiencies to do easy searches
], function LookModel(
    LookItem,
    SCModel,
    SearchHelper
) {
    'use strict';

    return SCModel.extend({

        // Required attribute for any SCModel. Should be the same as the Define name, sans the ".model"
        name: 'Look',
        record: 'customrecord_ef_lb_look',
        sort: 'custrecord_ef_lb_lbl_sequence',
        sortOrder: 'asc',
        columns: {
            internalid: { fieldName: 'internalid' },
            name: { fieldName: 'name' },
            sequence: { fieldName: 'custrecord_ef_lb_lbl_sequence', sort: 'asc' },
            urlcomponent: { fieldName: 'custrecord_ef_lb_lbl_url' },
            shortdesc: { fieldName: 'custrecord_ef_lb_lbl_shortdesc' },
            longdesc: { fieldName: 'custrecord_ef_lb_lbl_longdesc' },
            align: { fieldName: 'custrecord_ef_lb_lbl_rightalign' },
            textcolor: { fieldName: 'custrecord_ef_lb_lbl_textcolor' },
            linktext: { fieldName: 'custrecord_ef_lb_lbl_link' },
            image1: { fieldName: 'custrecord_ef_lb_lbl_image1', type: 'file' },
            image2: { fieldName: 'custrecord_ef_lb_lbl_image2', type: 'file' },
            image3: { fieldName: 'custrecord_ef_lb_lbl_image3', type: 'file' },
            title: { fieldName: 'custrecord_ef_lb_lbl_title' },
            metadesc: { fieldName: 'custrecord_ef_lb_lbl_metadesc' },
            metakeys: { fieldName: 'custrecord_ef_lb_lbl_metakeys' },
            lookbook: { fieldName: 'custrecord_ef_lb_lbl_book', type: 'text' },
            lookbookUrlcomponent: { fieldName: 'custrecord_ef_lb_lb_url', joinKey: 'custrecord_ef_lb_lbl_book' }
        },
        filters: [
            // basic filter that every search needs to take care off. Inactive is a native field
            { fieldName: 'isinactive', operator: 'is', value1: 'F' }
        ],
        getByLookBook: function getByLookBook(lookBookId) {
            var looks = [];
            var search = new SearchHelper(
                this.record,
                this.filters,
                this.columns,
                null,
                null,
                null,
                this.sort,
                this.sortOrder // this isn't having any effect, so use sort: 'asc' above
            );

            // add a filter to search for urlComponents
            search.addFilter({
                fieldName: this.columns.lookbook.fieldName,
                operator: 'is',
                value1: lookBookId
            });

            search.search();

            looks = search.getResults();

            return looks;
        },
        getByUrlComponent: function getByUrlComponent(urlComponent) {
            var look;

            var search = new SearchHelper(
                this.record,
                this.filters,
                this.columns
            );

            search.addFilter({ fieldName: this.columns.urlcomponent.fieldName, operator: 'is', value1: urlComponent });
            search.search();

            look = search.getResult();

            if (!look) {
                throw notFoundError;
            }

            look.items = LookItem.getByLook(look.internalid);

            return look;
        }
    });
});
