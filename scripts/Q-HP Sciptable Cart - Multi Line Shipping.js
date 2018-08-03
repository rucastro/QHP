function onRecalc(type, action){

    if ( type != 'item' ) {
        return;
    }
    try{
        if(nlapiGetContext().getExecutionContext() !== 'webstore') {
            return;
        }
        nlapiLogExecution('DEBUG', 'QHP - Multi Line Shipping',  'Recalc');

        nlapiLogExecution('DEBUG', 'QHP - Multi Line Shipping',  'Start');

        validateLines(type, action);

    }catch(err){
        nlapiLogExecution('debug', 'error', err);

    }finally{
        return true;

    }
}

function validateLines(type, action) {
    if(nlapiGetContext().getExecutionContext() !== 'webstore') return true;

    if ((type === 'item') && (action == 'commit')) {

        var isProcessing = nlapiGetFieldValue('custbody_is_processing');
        if (isProcessing === 'T') {
            return true;
        }

        try {

            nlapiSetFieldValue('custbody_is_processing', 'T', true, true);

            reAlignLineItems();

            // Functions Here

            // Get Line Items from Body

            //

        } catch(e) {

            nlapiLogExecution('ERROR', 'Scriptable cart error',  e);

        } finally {

            if (isProcessing !== 'T') {
                nlapiSetFieldValue('custbody_is_processing', 'F', true, true);
            }

            nlapiLogExecution('DEBUG', 'QHP - Multi Line Shipping',  'End');

        }
    }
}

function reAlignLineItems() {
    var warehouseObjects = nlapiGetFieldValue('custbody_qhp_warehouse_obj');

    if (!warehouseObjects) {
        return;
    }

    nlapiLogExecution('DEBUG', 'warehouseObjects',  warehouseObjects);

    var parseObject = JSON.parse(warehouseObjects);

    nlapiLogExecution('DEBUG', 'parseObject Length',  parseObject.length);

    if (parseObject && parseObject.length > 0) {
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

            nlapiLogExecution('DEBUG', 'Data',  'Item='+item+' Location='+location+' Quantity='+quantity+' Ship Method='+shipMethod);

            // Need Ship Address - shipaddress
            // Need Ship Carrier - shipcarrier

            nlapiSelectNewLineItem('item');
            nlapiSetCurrentLineItemValue('item','item', item);
            nlapiSetCurrentLineItemValue('item','location', location);
            nlapiSetCurrentLineItemValue('item','quantity', quantity);
            nlapiSetCurrentLineItemValue('item','shipaddress', shipAddress);
            nlapiSetCurrentLineItemValue('item','shipcarrier', shipCarrier);
            nlapiSetCurrentLineItemValue('item','shipmethod', shipMethod);
            nlapiCommitLineItem('item');
        }
    }
}

function onFieldChanged(type, action) {
    try{
        if(nlapiGetContext().getExecutionContext() !== 'webstore') {
            return;
        }

        if ( type != 'item' ) {
            return;
        }

        validateFieldChange(type, action);

    }catch(err){
        nlapiLogExecution('debug', 'error', err);

    }finally{
        return true;

    }
}

function validateFieldChange(type, action) {

    if(nlapiGetContext().getExecutionContext() !== 'webstore') return true;

    if ((type === 'item') && (action == 'commit')) {

        var isProcessing = nlapiGetFieldValue('custbody_is_processing');
        if (isProcessing === 'T') {
            return true;
        }

        try {

            nlapiSetFieldValue('custbody_is_processing', 'T', true, true);

            reAlignLineItems();

        } catch(e) {

            nlapiLogExecution('ERROR', 'Scriptable cart error',  e);

        } finally {

            if (isProcessing !== 'T') {
                nlapiSetFieldValue('custbody_is_processing', 'F', true, true);
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









function applyPriceLevelByMicrosite() {
    var totalQty = nlapiGetLineItemCount('item'),
        line;

    nlapiLogExecution('DEBUG', 'Apply Price Level By Microsite',  'Cart Count ' + totalQty);

    for (line = 1; line <= totalQty; line++){

        nlapiSelectLineItem('item', line);

        var sitePriceLevel = nlapiGetLineItemValue('item','custcol_tag_site_price_level',line);

        nlapiLogExecution('DEBUG', 'Price Level Fetch',  sitePriceLevel);

        if (sitePriceLevel) {

            nlapiSetCurrentLineItemValue('item','price', sitePriceLevel);

            nlapiCommitLineItem('item');
        }
    }
}

function validateEZShieldItem() {
    var totalQty = nlapiGetLineItemCount('item'),
        line;

    nlapiLogExecution('DEBUG', 'Step 1. Cart Count',  totalQty);

    var addEZShield = 0;

    var ezshieldToCreate = [];

    for (line = 1; line <= totalQty; line++){

        var isEZShieldEligible = nlapiGetLineItemValue('item','custcol_tag_eligible_for_ezshield',line);

        var referenceItem = nlapiGetLineItemValue('item','custcol_tag_ezshield_ref_item',line);

        if (isEZShieldEligible && isEZShieldEligible == 'T') {

            addEZShield++;

            var quantity  = nlapiGetLineItemValue('item', 'quantity', line);

            ezshieldToCreate.push({quantity:quantity, referenceItem:referenceItem});

        }
    }

    if (addEZShield > 0) {
        var ezShieldCount = ezshieldToCreate.length, x;
        var quantityToCommit = 0;
        for (x = 0; x < ezShieldCount; x++){
            var referenceItem = ezshieldToCreate[x].referenceItem;
            var quantity = ezshieldToCreate[x].quantity;

            quantity = parseInt(quantity);

            quantityToCommit = quantityToCommit + quantity;
        }

        addEZShieldItem(referenceItem, quantityToCommit);
    }
}

function validateFormsChecksItem() {

    nlapiLogExecution('DEBUG', 'Running validateFormsChecksItem', 'Forms Checks');

    var totalQty = nlapiGetLineItemCount('item'),
        line;

    nlapiLogExecution('DEBUG', 'Step 1. Cart Count',  totalQty);

    var logoOptionsToConfigure = 0;

    var logoOptionsToCreate = [];


    for (line = 1; line <= totalQty; line++){

        var hasLogoOption = nlapiGetLineItemValue('item','custcol_tag_logo_option',line);

        var item = nlapiGetLineItemValue('item','item',line);

        if (hasLogoOption) {

            var logoOptionItem = nlapiGetLineItemValue('item','custcol_tag_logo_option_item',line);

            logoOptionsToCreate.push({item:item, logoOptionItem:logoOptionItem});

            logoOptionsToConfigure++;
        }
    }

    if (logoOptionsToConfigure > 0) {

        var values = logoOptionsToCreate;

        var counts = {};

        values.forEach(function (v) {
            if (counts[v.logoOptionItem]) {counts[v.logoOptionItem]++;}
            else counts[v.logoOptionItem] = 1;
        });

        for(var index in counts) {
            var quantity = counts[index];
            var item = index;

            if (item && quantity) {
                addLogoOptionsItem(item, quantity);
            }

        }



    }
}

function addLogoOptionsItem(item, quantity) {
    nlapiLogExecution('DEBUG', 'Add Logo Options Item',  item);

    nlapiSelectNewLineItem('item');
    nlapiSetCurrentLineItemValue('item','custcol_tag_is_logo_option_item', 'T');
    nlapiSetCurrentLineItemValue('item','item', item);
    nlapiSetCurrentLineItemValue('item','quantity', quantity);
    nlapiCommitLineItem('item');

}

function resetAllItemsOptions() {
    nlapiLogExecution('DEBUG', 'Resetting all Item Options', 'Forms Checks and EZ Shield');

    var totalQty = nlapiGetLineItemCount('item'),
        line;

    for (line = 1; line <= totalQty; line++){

        var isLogoOption = nlapiGetLineItemValue('item','custcol_tag_is_logo_option_item',line);

        var isEzShieldOption = nlapiGetLineItemValue('item','custcol_tag_is_ezshield',line);


        if (isLogoOption == 'T' || isEzShieldOption == 'T') {
            nlapiRemoveLineItem('item', line);
        }
    }
}

function addEZShieldItem(referenceItem, quantity) {
    nlapiLogExecution('DEBUG', 'addEZShieldItem',  referenceItem);

    nlapiSelectNewLineItem('item');
    nlapiSetCurrentLineItemValue('item','item', referenceItem);
    nlapiSetCurrentLineItemValue('item','custcol_tag_is_ezshield', 'T');
    nlapiSetCurrentLineItemValue('item','quantity', quantity);
    nlapiCommitLineItem('item');
}

function validatePairForEZShield(referenceItem) {

    // Get the current item
    // Check its reference item if its still on the lines if not remove this item

    nlapiLogExecution('DEBUG', 'Validate Pair Item',  referenceItem);

    var totalQty = nlapiGetLineItemCount('item'),
        line;

    var count = 0;

    for (line = 1; line <= totalQty; line++){

        var item = nlapiGetLineItemValue('item','item',line);

        if (referenceItem == item) {
            count++;
        }
    }

    if (count > 0) {
        return true;
    }


}

function resetPairForEZShield(item) {

    nlapiLogExecution('DEBUG', 'Reset Pair Item',  item);

    var totalQty = nlapiGetLineItemCount('item'),
        line;

    for (line = 1; line <= totalQty; line++){

        var thisReferenceItem = nlapiGetLineItemValue('item','custcol_tag_ezshield_ref_item',line);

        // If the current item that is validated is referenced to this current item remove it
        if (item == thisReferenceItem) {
            nlapiRemoveLineItem('item', line);
            nlapiLogExecution('DEBUG', 'Reset Pair Item for ' + item,  'Successful');

            break;
        }
    }
}
