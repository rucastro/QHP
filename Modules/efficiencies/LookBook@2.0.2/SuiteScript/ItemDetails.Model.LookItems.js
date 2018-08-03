define('ItemDetails.Model.LookItems', [
    'LookItem.Model',
    'SearchHelper',
    'underscore'
], function LookModel(
    LookItem,
    SearchHelper,
    _
) {
    'use strict';

    return LookItem.extend({
        name: 'ItemDetailsLookItems',

        _getLookIDs: function _getLookIDs(itemID) {
            var looks = null;

            var search = new SearchHelper(
                this.record,
                this.filters,
                { look: this.columns.look }
            );

            search.addFilter({
                fieldName: this.columns.item.fieldName,
                operator: 'is',
                value1: itemID
            });

            search.search();
            looks = search.getResults();
            return _.pluck(looks, 'look');
        },

        getSameLookItem: function getSameLookItem(itemID) {
            var lookItems = [];
            var lookIDs = _.uniq(_.compact(this._getLookIDs(itemID)));

            if (lookIDs.length > 0) {
                lookItems = this.getByLook(lookIDs, {
                    filter: {
                        item: {
                            fieldName: this.columns.item.fieldName,
                            operator: 'noneof',
                            value1: itemID
                        }
                    }
                });
            }
            return lookItems;
        }
    });
});
