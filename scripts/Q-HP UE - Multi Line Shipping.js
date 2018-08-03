function reAlignLineItems() {
    var warehouseObjects = nlapiGetFieldValue('custbody_qhp_warehouse_obj');

    if (!warehouseObjects) {
        return;
    }

    nlapiLogExecution('DEBUG', 'warehouseObjects',  warehouseObjects);

    var parseObject = JSON.parse(warehouseObjects);

    nlapiLogExecution('DEBUG', 'parseObject Length',  parseObject.length);

    var psServiceItem = nlapiGetContext().getSetting('SCRIPT', 'custscript_qhp_ps_service_item');

    nlapiLogExecution('DEBUG', 'PS Item',  psServiceItem);

    if (parseObject && parseObject.length > 0 && psServiceItem) {
        enableMultiLineShipping();
        removeLines();

        var totalItems = parseObject.length,
            line;

        for (line = 0; line < totalItems; line++){
            var item = parseObject[line].item;
            var location = parseObject[line].location;
            var quantity = parseObject[line].quantity;
            var shipMethod = parseObject[line].shipMethod;
            var shipAddress = parseObject[line].shipAddress;
            var shipCarrier = parseObject[line].carrier;
            var shipCost = parseObject[line].shipCost;
            var isPriorityShipping = parseObject[line].priorityShipping;

            nlapiLogExecution('DEBUG', 'Data',  'Item='+item+' Location='+location+' Quantity='+quantity+' Ship Method='+shipMethod);

            // Need Ship Address - shipaddress
            // Need Ship Carrier - shipcarrier

            nlapiSelectNewLineItem('item');
            nlapiSetCurrentLineItemValue('item','item', item);
            nlapiSetCurrentLineItemValue('item','location', location);
            nlapiSetCurrentLineItemValue('item','quantity', quantity);
            //nlapiSetCurrentLineItemValue('item','price', 5); // Online Price Level
            nlapiSetCurrentLineItemValue('item','price', 1); // Base Price Level
            nlapiSetCurrentLineItemValue('item','shipaddress', shipAddress);
            nlapiSetCurrentLineItemValue('item','shipcarrier', shipCarrier);
            nlapiSetCurrentLineItemValue('item','shipmethod', shipMethod);
            nlapiCommitLineItem('item');

            if (isPriorityShipping && psServiceItem) {
                nlapiSelectNewLineItem('item');
                nlapiSetCurrentLineItemValue('item','item', psServiceItem);
                nlapiSetCurrentLineItemValue('item','location', location);
                //nlapiSetCurrentLineItemValue('item','price', 5); // Online Price Level
                nlapiSetCurrentLineItemValue('item','price', -1); // Custom Price Level
                nlapiSetCurrentLineItemValue('item','amount', shipCost);
                nlapiCommitLineItem('item');
            }
        }


    }
}

function removeLines() {
    var totalQty = nlapiGetLineItemCount('item'),
        line;

    for (line = totalQty; line >= 1; line--){
         nlapiRemoveLineItem('item', line);
    }
}

function enableMultiLineShipping() {
    nlapiSetFieldValue('ismultishipto', 'T', true, true);
}

function beforeSubmit() {
    //if (nlapiGetContext().getExecutionContext().toString() == 'webstore') {
        try {

            // [{"item":8060,"location":"72","quantity":100,"shipMethod":"8025","shipAddress":"1041","carrier":"nonups"},{"item":8339,"location":"72","quantity":50,"shipMethod":"8025","shipAddress":"1041","carrier":"nonups"},{"item":8060,"location":"18","quantity":100,"shipMethod":"8025","shipAddress":"1041","carrier":"nonups"},{"item":8060,"location":"52","quantity":50,"shipMethod":"8025","shipAddress":"1041","carrier":"nonups"}]

            var context = nlapiGetContext();

            reAlignLineItems();

            nlapiLogExecution('DEBUG', 'remaining usage', context.getRemainingUsage());

        } catch (e) {
            nlapiLogExecution('ERROR', 'Error on Q-HP UE SO - Multi Line Shipping', e);
        }
    //}

}

function afterSubmit() {
    //if (nlapiGetContext().getExecutionContext().toString() == 'webstore') {
        try {

            // [{"item":8060,"location":"72","quantity":100,"shipMethod":"8025","shipAddress":"1041","carrier":"nonups"},{"item":8339,"location":"72","quantity":50,"shipMethod":"8025","shipAddress":"1041","carrier":"nonups"},{"item":8060,"location":"18","quantity":100,"shipMethod":"8025","shipAddress":"1041","carrier":"nonups"},{"item":8060,"location":"52","quantity":50,"shipMethod":"8025","shipAddress":"1041","carrier":"nonups"}]

            var context = nlapiGetContext();

            var record;

            if (type == 'edit') {
                var recordId = nlapiGetRecordId();
                var recordType = nlapiGetRecordType();
                record = nlapiLoadRecord(recordType, recordId);
            } else {
                record = nlapiGetNewRecord();
            }

            var warehouseObjects = record.getFieldValue('custbody_qhp_warehouse_obj');

            if (!warehouseObjects) {
                return;
            }

            nlapiLogExecution('DEBUG', 'warehouseObjects',  warehouseObjects);

            var parseObject = JSON.parse(warehouseObjects);

            nlapiLogExecution('DEBUG', 'parseObject Length',  parseObject.length);

            if (parseObject && parseObject.length > 0) {
                record.setFieldValue('ismultishipto', 'T');

                var itemSublistCnt = record.getLineItemCount('item');
                for (var x = 1; x <= itemSublistCnt; x++) {
                    record.removeLineItem('item', x);
                }

                var totalItems = parseObject.length,
                    line;

                for (line = 0; line < totalItems; line++){
                    var item = parseObject[line].item;
                    var location = parseObject[line].location;
                    var quantity = parseObject[line].quantity;
                    var shipMethod = parseObject[line].shipMethod;
                    var shipAddress = parseObject[line].shipAddress;
                    var shipCarrier = parseObject[line].carrier;

                    nlapiLogExecution('DEBUG', 'Data',  'Item='+item+' Location='+location+' Quantity='+quantity+' Ship Method='+shipMethod);

                    // Need Ship Address - shipaddress
                    // Need Ship Carrier - shipcarrier

                    record.selectNewLineItem('item');
                    record.setCurrentLineItemValue('item','item', item);
                    record.setCurrentLineItemValue('item','location', location);
                    record.setCurrentLineItemValue('item','quantity', quantity);
                    record.setCurrentLineItemValue('item','price', 5); // Online Price Level
                    record.setCurrentLineItemValue('item','shipaddress', shipAddress);
                    record.setCurrentLineItemValue('item','shipcarrier', shipCarrier);
                    record.setCurrentLineItemValue('item','shipmethod', shipMethod);
                    record.commitLineItem('item');
                }

                nlapiSubmitRecord(record);

            }

            nlapiLogExecution('DEBUG', 'remaining usage', context.getRemainingUsage());

        } catch (e) {
            nlapiLogExecution('ERROR', 'Error on Q-HP UE SO - Multi Line Shipping', e);
        }
    //}

}
