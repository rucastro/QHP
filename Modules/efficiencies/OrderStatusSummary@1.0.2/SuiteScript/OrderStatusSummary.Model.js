define('OrderStatusSummary.Model', [
    'SC.Model',
    'Models.Init',
    'SearchHelper',
    'underscore'
], function OrderStatusSummaryModel(
    SCModel,
    CommerceAPI,
    SearchHelper,
    _
) {
    'use strict';

    var FULFILLMENTCHOICE_SHIPPING = 1;
    var FULFILLMENTCHOICE_PICKUP_IN_STORE = 2;

    var STATUS_PENDING = 0;
    var STATUS_SHIPPED = 1;
    var STATUS_READY_FOR_PICKUP = 2;
    var STATUS_PICKED_UP = 3;

    var ORDER_STATUS_TEXT = {};

    ORDER_STATUS_TEXT[STATUS_PENDING] = 'processing';
    ORDER_STATUS_TEXT[STATUS_READY_FOR_PICKUP] = 'ready for pickup';
    ORDER_STATUS_TEXT[STATUS_PICKED_UP] = 'picked up';
    ORDER_STATUS_TEXT[STATUS_SHIPPED] = 'shipped';

    return SCModel.extend({
        name: 'OrderStatusSummary',

        record: 'salesorder',

        statusesWithNoSummary: ['cancelled', 'closed', 'pendingApproval'],

        filters: [
            {
                fieldName: 'mainline',
                operator: 'is',
                value1: 'F'
            },
            {
                fieldName: 'taxline',
                operator: 'is',
                value1: 'F'
            },
            {
                fieldName: 'shipping',
                operator: 'is',
                value1: 'F'
            }
        ],

        columns: {
            internalid: {
                fieldName: 'internalid',
                summary: 'group'
            },
            itemsForShippingQty: {
                fieldName: 'quantity',
                summary: 'SUM'
            },
            itemsForShippingQtyPicked: {
                fieldName: 'quantitypicked',
                summary: 'SUM'
            },
            itemsForShippingQtyPacked: {
                fieldName: 'quantitypacked',
                summary: 'SUM'
            },
            itemsForShippingQtyShippped: {
                fieldName: 'quantityshiprecv',
                summary: 'SUM'
            }
        },

        columnsBOPIS: {
            internalid: {
                fieldName: 'internalid',
                summary: 'group'
            },
            itemsForShippingQty: {
                fieldName: 'formulanumeric',
                summary: 'SUM',
                formula: 'CASE WHEN {itemfulfillmentchoice.id} = ' + FULFILLMENTCHOICE_SHIPPING + ' THEN {quantity} ELSE 0 END',
                index: '1'
            },
            itemsForStorePickupQty: {
                fieldName: 'formulanumeric',
                summary: 'SUM',
                formula: 'CASE WHEN {itemfulfillmentchoice.id} = ' + FULFILLMENTCHOICE_PICKUP_IN_STORE +
                         ' THEN {quantity} ELSE 0 END',
                index: '2'
            },
            itemsForShippingQtyPicked: {
                fieldName: 'formulanumeric',
                summary: 'SUM',
                formula: 'CASE WHEN {itemfulfillmentchoice.id} = ' + FULFILLMENTCHOICE_SHIPPING +
                         ' THEN {quantitypicked} ELSE 0 END',
                index: '3'
            },
            itemsForStorePickupQtyPicked: {
                fieldName: 'formulanumeric',
                summary: 'SUM',
                formula: 'CASE WHEN {itemfulfillmentchoice.id} = ' + FULFILLMENTCHOICE_PICKUP_IN_STORE +
                         ' THEN {quantitypicked} ELSE 0 END',
                index: '4'
            },
            itemsForShippingQtyPacked: {
                fieldName: 'formulanumeric',
                summary: 'SUM',
                formula: 'CASE WHEN {itemfulfillmentchoice.id} = ' + FULFILLMENTCHOICE_SHIPPING +
                         ' THEN {quantitypacked} ELSE 0 END',
                index: '5'
            },
            itemsForStorePickupQtyPacked: {
                fieldName: 'formulanumeric',
                summary: 'SUM',
                formula: 'CASE WHEN {itemfulfillmentchoice.id} = ' + FULFILLMENTCHOICE_PICKUP_IN_STORE +
                         ' THEN {quantitypacked} ELSE 0 END',
                index: '6'
            },
            itemsForShippingQtyShippped: {
                fieldName: 'formulanumeric',
                summary: 'SUM',
                formula: 'CASE WHEN {itemfulfillmentchoice.id} = ' + FULFILLMENTCHOICE_SHIPPING +
                         ' THEN {quantityshiprecv} ELSE 0 END',
                index: '7'
            },
            itemsForStorePickupQtyPickedUp: {
                fieldName: 'formulanumeric',
                summary: 'SUM',
                formula: 'CASE WHEN {itemfulfillmentchoice.id} = ' + FULFILLMENTCHOICE_PICKUP_IN_STORE +
                         ' THEN {quantityshiprecv} ELSE 0 END',
                index: '8'
            }
        },

        columnsLocations: {
            location: {
                fieldName: 'location'
            },
            internalid: {
                fieldName: 'internalid',
                joinKey: 'location'
            },
            name: {
                fieldName: 'name',
                joinKey: 'location'
            },
            address1: {
                fieldName: 'address1',
                joinKey: 'location'
            },
            address2: {
                fieldName: 'address2',
                joinKey: 'location'
            },
            country: {
                fieldName: 'country',
                joinKey: 'location'
            },
            phone: {
                fieldName: 'phone',
                joinKey: 'location'
            },
            city: {
                fieldName: 'city',
                joinKey: 'location'
            },
            state: {
                fieldName: 'state',
                joinKey: 'location'
            },
            zip: {
                fieldName: 'zip',
                joinKey: 'location'
            }
        },

        get: function get(id, filter) {
            var filters = _.clone(this.filters);
            var columns = _.clone(this.columns);
            var search;
            var result;
            var isStatusText = false;

            if (this.isBOPISEnabled()) {
                columns = _.clone(this.columnsBOPIS);
                if (filter) {
                    filters.push(filter);
                    isStatusText = true;
                }
            }

            filters.push({
                fieldName: columns.internalid.fieldName,
                operator: 'is',
                value1: id
            });

            search = new SearchHelper(this.record, filters, columns);
            result = search.search().getResults();

            return this._mapOrderStatus(result, isStatusText);
        },

        getLocation: function getLocation(id) {
            var filters = _.clone(this.filters);
            var search;
            var result;

            if (!this.isBOPISEnabled()) {
                return false;
            }

            filters.push(
                {
                    fieldName: this.columnsLocations.internalid.fieldName,
                    operator: 'is',
                    value1: id
                },
                {
                    fieldName: 'location',
                    operator: 'noneof',
                    value1: '@NONE@'
                }
            );

            search = new SearchHelper(this.record, filters, this.columnsLocations);
            result = search.search().getResults();

            return result;
        },

        _mapOrderStatus: function _mapOrderStatus(data, isStatusText) {
            var self = this;
            var orderStatus = {};
            var lines;
            var keys;
            var values;

            _.each(data, function checkLines(line) {
                keys = _.keys(line);
                values = _.map(line, function parseIntLine(val) {
                    return (val !== 'ERROR: Field Not Found') ? parseInt(val, 10) : 0;
                });
                lines = _.object(keys, values);

                orderStatus[line.internalid] = self.getOrderStatusSummaryText(lines, isStatusText);
            });

            return orderStatus;
        },

        getOrderStatusSummaryText: function getOrderStatusSummaryText(params, isStatusText) {
            var statusText = [];
            var itemsNotShippedQty = 0;
            var itemsReadyForPickedUpQty = 0;
            var itemsNotReadyForPickedUpQty = 0;
            var pendingItemQty = 0;
            var hasPendingQty = false;
            var pendingType = 0;
            var status = {};
            var text;

            // items for store pickup
            if (this.isBOPISEnabled()) {
                if (params.itemsForStorePickupQty !== params.itemsForStorePickupQtyPickedUp) {
                    itemsReadyForPickedUpQty = params.itemsForStorePickupQtyPicked - params.itemsForStorePickupQtyPickedUp;

                    itemsNotReadyForPickedUpQty = params.itemsForStorePickupQty - params.itemsForStorePickupQtyPickedUp;
                    itemsNotReadyForPickedUpQty -= itemsReadyForPickedUpQty;

                    if (itemsReadyForPickedUpQty !== 0) {
                        text = this._setStatusText({
                            status: STATUS_READY_FOR_PICKUP,
                            quantity: itemsReadyForPickedUpQty,
                            type: FULFILLMENTCHOICE_PICKUP_IN_STORE
                        });

                        statusText.push(text);
                        status.pickup = text;
                    }
                }

                if (params.itemsForStorePickupQtyPickedUp !== 0) {
                    text = this._setStatusText({
                        status: STATUS_PICKED_UP,
                        quantity: params.itemsForStorePickupQtyPickedUp,
                        type: FULFILLMENTCHOICE_PICKUP_IN_STORE
                    });

                    statusText.push(text);

                    status.pickup = text;
                }
            }

            // items for shipping
            itemsNotShippedQty = params.itemsForShippingQty - params.itemsForShippingQtyShippped;
            if (params.itemsForShippingQtyShippped !== 0) {
                text = this._setStatusText({
                    status: STATUS_SHIPPED,
                    quantity: params.itemsForShippingQtyShippped,
                    type: FULFILLMENTCHOICE_SHIPPING
                });

                statusText.push(text);

                status.shipping = text;
            }

            if (itemsNotShippedQty !== 0 && itemsNotReadyForPickedUpQty !== 0) {
                pendingItemQty = itemsNotShippedQty + itemsNotReadyForPickedUpQty;
                pendingType = [FULFILLMENTCHOICE_PICKUP_IN_STORE, FULFILLMENTCHOICE_SHIPPING];
                hasPendingQty = true;
            } else {
                if (itemsNotShippedQty !== 0) {
                    pendingItemQty = itemsNotShippedQty;
                    pendingType = FULFILLMENTCHOICE_SHIPPING;
                }

                if (itemsNotReadyForPickedUpQty !== 0) {
                    pendingItemQty = itemsNotReadyForPickedUpQty;
                    pendingType = FULFILLMENTCHOICE_PICKUP_IN_STORE;
                }

                hasPendingQty = pendingItemQty !== 0;
            }

            if (hasPendingQty) {
                text = this._setStatusText({
                    status: STATUS_PENDING,
                    quantity: pendingItemQty,
                    type: pendingType
                });

                statusText.push(text);

                status.shipping = text;
            }

            if (isStatusText) {
                return _.flatten(statusText).join(', ');
            }

            return status;
        },

        _setStatusText: function _setStatusText(options) {
            var itemText = 'item';

            return options.quantity +
                   ' ' +
                   (options.quantity === 1 ? itemText : itemText + 's') + ' ' +
                   ORDER_STATUS_TEXT[options.status];
        },

        isBOPISEnabled: function isBOPISEnabled() {
            return CommerceAPI.context.getSetting('FEATURE', 'storepickup') === 'T';
        }
    });
});
