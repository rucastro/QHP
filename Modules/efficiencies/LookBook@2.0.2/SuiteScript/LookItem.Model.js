define('LookItem.Model', [
    'SC.Model',
    'SearchHelper',
    'ItemsResultHelper',
    'underscore'
], function LookItemModel(
    SCModel,
    SearchHelper,
    ItemsResultHelper,
    _
) {
    'use strict';

    return SCModel.extend({
        name: 'LookItem',

        // This is used by the SearchHelper record
        record: 'customrecord_ef_lb_lbl_item',
        columns: {
            name: { fieldName: 'name' },
            item: { fieldName: 'custrecord_ef_lb_lbli_item' },
            itemType: {
                fieldName: 'type',
                joinKey: 'custrecord_ef_lb_lbli_item'
            },
            sequence: { fieldName: 'custrecord_ef_lb_lbli_sequence', sort: 'asc' },
            look: { fieldName: 'custrecord_ef_lb_lbli_look' },
            description: { fieldName: 'custrecord_ef_lb_lbli_description' },
            link: { fieldName: 'custrecord_ef_lb_lbli_link' },
            imageid: { fieldName: 'custrecord_ef_lb_lbli_image' },
            image: { fieldName: 'custrecord_ef_lb_lbli_image', type: 'file' }
        },
        filters: [
            { fieldName: 'isinactive', operator: 'is', value1: 'F' }
        ],
        getByLook: function getByLook(lookId, options) {
            var looks;
            var search = new SearchHelper(
                this.record,
                this.filters,
                this.columns
            );
            var itemHelper;

            // add a filter to search for urlComponents
            search.addFilter({
                fieldName: this.columns.look.fieldName,
                operator: 'is',
                value1: lookId
            });

            if (options && options.filter) {
                _.each(options.filter, function eachData(filter) {
                    search.addFilter(filter);
                });
            }

            search.search();

            looks = search.getResults();

            itemHelper = new ItemsResultHelper(this.record, this.columns.item, 'item', 'itemType');
            itemHelper.processResults(looks);
            return looks;
        }
    });
});
