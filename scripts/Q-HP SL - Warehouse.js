var Warehouse = {

    initialize: function(request, response) {
        var result = [];

        var context = nlapiGetContext();

        switch (request.getMethod()) {
            case 'GET':
                var requestType = request.getParameter('requestType') || null;
                var itemId = request.getParameter('itemId') || null;
                var quantity = request.getParameter('quantity') || null;
                var address = request.getParameter('address') || null;


                // Test Item - Id 8060
                // Rishi Jacket 8339

                if (requestType == 'getAvailableStock') {
                    result = this._getAvailableStock(itemId);
                } else if (requestType == 'getNearestLocation') {
                    result = this._getNearestLocationFromCustomerToWarehouse(address, itemId);
                } else if (requestType == 'getEligibleWarehouse') {
                    result = this._mapOrderQuantityToAvailableLocation(itemId, quantity, address);
                } else if (requestType == 'searchWarehouse') {
                    result = this._putPost(request);
                } else {
                    result = {message:"No Parameters"};
                }
                break;

            case 'POST':
                result = this._putPost(request);

                break;
        }

        nlapiLogExecution('DEBUG', 'remaining usage', (context.getRemainingUsage()).toString());

        response.write(JSON.stringify(result));
    },

    _putPost: function(request) {
        var items = JSON.parse(request.getParameter('items')) || null;
        var address = request.getParameter('address') || null;

        nlapiLogExecution('DEBUG', '_putPost', JSON.stringify(items));

        if (!address) {
            address = '2955 Campus Drive, Suite 250 San Mateo CA';
        }

        // if (!items) {
        //     items = [
        //         {itemId:8060, quantity:250},
        //         {itemId:8339, quantity:250}
        //     ];
        // }

        if (!items) {
            items = [
                {itemId:8035, quantity:600},
                {itemId:8060, quantity:350}
            ];
        }


        items = JSON.stringify(items);

        var warehouses = this._mapOrderQuantityToAvailableLocationByItemIds(items, address);

        warehouses = this._combineWarehouses(52, 72, warehouses);

        return {warehouses:warehouses};
    },

    _combineWarehouses: function(fromWarehouse, toWarehouse, warehouses) {
        if (!fromWarehouse) fromWarehouse = 52;
        if (!toWarehouse) toWarehouse = 72;

        // Loop through the fromWahouse
        // Get the Items
            // If Same Item Id 
                // Check the Available Quantity
                // Adjust if there are move quantity
                // Backorder if no more quantity
            // If Not same Id
                // Automatic Backorder    
        
        // Add Items to the toWarehouse

        var itemsToMove = [];
        var indexOfWarehouseToSplice = -1;

        for (var x = 0; x < warehouses.length; x++) {
            var warehouse = warehouses[x];
            if (warehouse.id == fromWarehouse) {
                var itemsAllocatedInWarehouse = warehouse.itemsAllocatedInWarehouse;

                for (var y = 0; y < itemsAllocatedInWarehouse.length; y++) {
                    var item = itemsAllocatedInWarehouse[y];
                    
                    itemsToMove.push(item);

                }
            }
        }

        if (itemsToMove.length > 0) {
            for (var z = 0; z < warehouses.length; z++) {
                var warehouse = warehouses[z];
                if (warehouse.id == toWarehouse) { 
                    var itemsAllocatedInWarehouse = warehouse.itemsAllocatedInWarehouse;
                    
                    for (var i = 0; i < itemsToMove.length; i++) {
                        var item = itemsToMove[i];
                        var hasIncluded = false;

                        for (var j = 0; j < itemsAllocatedInWarehouse.length; j++ ) {
                            var itemAllocated = itemsAllocatedInWarehouse[j];

                            if (itemAllocated.itemId == item.itemId && itemAllocated.status == 'backordered') {
                                var quantity = parseInt(itemAllocated.commitedQuantity);
                                    quantity = quantity + parseInt(item.commitedQuantity);
                                    itemAllocated.commitedQuantity = quantity;

                                    hasIncluded = true;
                            } 
                        }

                        if (!hasIncluded) {
                            item.status = 'backordered';
                            item.quantityAvailable = 0;
                            itemsAllocatedInWarehouse.push(item);
                        }
    
                    }
                    
                }

                if (warehouse.id == fromWarehouse) {
                    indexOfWarehouseToSplice = z;
                }
            }
        }

        warehouses.splice(indexOfWarehouseToSplice, 1);

        return warehouses;

        nlapiLogExecution('DEBUG', 'itemsToMove', JSON.stringify(itemsToMove));
    },

    _getDefaultWarehouse: function(warehouseId) {
        var location = nlapiLoadRecord('location', warehouseId);
        var address = location.getFieldValue('returnaddress1')+' '+ location.getFieldValue('city') +' '+ location.getFieldValue('country');
        var warehouse = {
                        id: warehouseId,
                        name: location.getFieldValue('name'),
                        longitude: location.getFieldValue('longitude'),
                        latitude: location.getFieldValue('latitude'),
                        address: address,
                        zipcode: location.getFieldValue('zip')
                    };

        return warehouse;            
    },

    _searchWarehousesByItemIds: function(items) {
        items = JSON.parse(items);

        var filterItems = [];
        var itemLookUp = [];
        
        var defaultLocation = nlapiGetContext().getSetting('SCRIPT', 'custscript_qhp_default_warehouse');
        var defaultWarehouse = this._getDefaultWarehouse(defaultLocation);

        for (var x = 0; x < items.length; x++) {

            filterItems.push(items[x].itemId);

            itemLookUp[items[x].itemId] = items[x].quantity;

        }

        var arrSearchFilter = new Array();
            arrSearchFilter[0] = new nlobjSearchFilter('internalid', null, 'anyof', filterItems);


        var searchResults = nlapiSearchRecord('item', 'customsearch_qhp_item_with_qty_available',
                arrSearchFilter, // filters
                [] // columns
            );

        //nlapiLogExecution('DEBUG', 'search results', JSON.stringify(searchResults));

        // Group Items per Warehouse

        var isDefaultWarehouseInTheList = false;

        var warehouses = [];

        if (searchResults) {

            var itemsToCheck = items;

            for (var y = 0; y < searchResults.length; y++) {

                var columns = searchResults[y].getAllColumns();

                var id = searchResults[y].getValue(columns[0]);
                var name = searchResults[y].getValue(columns[1]);
                var quantityAvailable = searchResults[y].getValue(columns[2]);
                var longitude = searchResults[y].getValue(columns[3]);
                var latitude = searchResults[y].getValue(columns[4]);
                var address = searchResults[y].getValue(columns[5]);
                var zipcode = searchResults[y].getValue(columns[6]);

                var itemId = searchResults[y].id;
                var quantity = itemLookUp[itemId];

                var items = [];
                    items.push({itemId: itemId, quantityOrder: quantity, quantityAvailable: quantityAvailable});

                if (!isDefaultWarehouseInTheList) {
                    if (id == defaultLocation) {
                        isDefaultWarehouseInTheList = true;
                    }
                }

                if (warehouses.length == 0) {
                    var warehouse = {
                        id:id,
                        name:name,
                        longitude:longitude,
                        latitude:latitude,
                        address:address,
                        zipcode:zipcode,
                        itemsAllocatedInWarehouse:items
                    };

                    warehouses.push(warehouse);
                } else {

                    var hasExistenceFlag = false;

                    for (var z = 0; z < warehouses.length; z++) {
                        var warehouseId = warehouses[z].id;

                        if (warehouseId == id) {
                            var warehouseItems = warehouses[z].itemsAllocatedInWarehouse;
                                warehouseItems.push({itemId: itemId, quantityOrder: quantity, quantityAvailable: quantityAvailable});

                            warehouses[z].itemsAllocatedInWarehouse = warehouseItems;

                            hasExistenceFlag = true;
                        }
                    }

                    if (!hasExistenceFlag) {
                        var warehouse = {
                            id:id,
                            name:name,
                            longitude:longitude,
                            latitude:latitude,
                            address:address,
                            zipcode:zipcode,
                            itemsAllocatedInWarehouse:items
                        };

                        warehouses.push(warehouse);
                    }

                }



                //nlapiLogExecution('DEBUG', 'warehouseId', id);
                //nlapiLogExecution('DEBUG', 'itemId', itemId);
                //nlapiLogExecution('DEBUG', 'warehouses', JSON.stringify(warehouses));
            }

            // Check wether the items has been inserted to one of the warehouse

            for (var k = 0; k < itemsToCheck.length; k++) {
                var isItemIncludedAcrossWarehouses = false;

                for (var i = 0; i < warehouses.length; i++) {
                    var itemsAllocatedInWarehouse = warehouses[i].itemsAllocatedInWarehouse;

                    for (var j = 0; j < itemsAllocatedInWarehouse.length; j++) {
                        if (itemsToCheck[k].itemId == itemsAllocatedInWarehouse[j].itemId) {
                            isItemIncludedAcrossWarehouses = true;
                            break;
                        }
                    }

                    if (!isItemIncludedAcrossWarehouses) {
                        break;
                    }
                }

                nlapiLogExecution('DEBUG', 'Done Processing Item='+itemsToCheck[k].itemId, itemsToCheck[k].itemId);

                if (!isItemIncludedAcrossWarehouses) {
                    filterItems = [];
                    // for (var x = 0; x < items.length; x++) {
                    //     filterItems.push({itemId: itemsToCheck[x].itemId, quantityOrder: itemsToCheck[x].quantity, quantityAvailable: 0});
                    // }

                    // Check if the default warehouse is in the list
                    nlapiLogExecution('DEBUG', 'Is default warehouse included in the list?', isDefaultWarehouseInTheList);
                    if (isDefaultWarehouseInTheList) {
                        //Loop through warehouses and add the item to the warehouse
                        for (var l = 0; l < warehouses.length; l++) {
                            if (warehouses[l].id == defaultLocation) {
                                var itemsAllocatedInWarehouse = warehouses[l].itemsAllocatedInWarehouse;
                                    itemsAllocatedInWarehouse.push({itemId: (itemsToCheck[k].itemId).toString(), quantityOrder: itemsToCheck[k].quantity, quantityAvailable: -1});

                                warehouses[l].itemsAllocatedInWarehouse = itemsAllocatedInWarehouse;

                                break;
                            }
                        }

                    } else {

                        filterItems.push({itemId: (itemsToCheck[k].itemId).toString(), quantityOrder: itemsToCheck[k].quantity, quantityAvailable: -1});

                        defaultWarehouse.itemsAllocatedInWarehouse = filterItems;
                        warehouses.push(defaultWarehouse);
                    }
                    // Add Item to the Default Warehouse
                    
                    nlapiLogExecution('DEBUG', 'Item not Included in Warehouse', itemsToCheck[k].itemId);
                }
            }

            

        } else {
            nlapiLogExecution('DEBUG', 'Totally No Results Found', '_searchWarehousesByItemIds');
            filterItems = [];
            for (var x = 0; x < items.length; x++) {
                filterItems.push({itemId: (items[x].itemId).toString(), quantityOrder: items[x].quantity, quantityAvailable: -1});
            }

            defaultWarehouse.itemsAllocatedInWarehouse = filterItems;

            warehouses.push(defaultWarehouse);

            return warehouses;
        }

        return warehouses;
    },

    _mapLocationDetailsToWarehouse: function(locationId, address) {
        address = address.replace(/ /g,"+");

        var points = this._getPoints(address);

        nlapiSubmitField('location', locationId,
            ['latitude', 'longitude'],
            [points.latitude, points.longitude]);

        return points;
    },

    _mapOrderQuantityToAvailableLocation: function(itemId, quantity, address) {
        var warehousesToUse = [];

        var totalQuantity = quantity;

        var eligibleWarehouses = this._getNearestLocationFromCustomerToWarehouse(address, itemId);

        for (var x = 0; x < eligibleWarehouses.length; x++) {
            var quantityAvailable = parseInt(eligibleWarehouses[x].quantityAvailable);

            nlapiLogExecution('DEBUG', 'quantityAvailable', quantityAvailable);

            if (totalQuantity > 0) {
                warehousesToUse.push(eligibleWarehouses[x]);

                var quantityAvailed = 0;
                if (totalQuantity >= quantityAvailable) {
                    quantityAvailed = quantityAvailable;
                } else if (totalQuantity < quantityAvailable) {
                    quantityAvailed = totalQuantity;
                }

                eligibleWarehouses[x].commitedQuantity = quantityAvailed;

                nlapiLogExecution('DEBUG', 'Warehouse ' + eligibleWarehouses[x].name + ' Quantity Avail + ' + quantityAvailed, 'Test');

                totalQuantity = totalQuantity - quantityAvailable;
            }
        }

        return warehousesToUse;
    },

    _mapOrderQuantityToAvailableLocationByItemIds: function(items, address) {
        var warehousesToUse = [];

        //var totalQuantity = quantity;

        var eligibleWarehouses = this._getNearestLocationFromCustomerToWarehouseByItemIds(items, address);

        if (eligibleWarehouses.length > 0) {

            items = JSON.parse(items);

            for (var z = 0; z < items.length; z++) {

                var totalQuantity = items[z].quantity;
                var itemId = items[z].itemId;

                for (var x = 0; x < eligibleWarehouses.length; x++) {

                    var itemsOnWarehouse = eligibleWarehouses[x].itemsAllocatedInWarehouse;

                    var hasEligibleQuantity = false;
                    var itemIndex = 0;

                    for (var y = 0; y < itemsOnWarehouse.length; y++) {
                        var itemIdOnWarehouse = itemsOnWarehouse[y].itemId;

                        if (itemIdOnWarehouse == itemId) {
                            hasEligibleQuantity = true;
                            itemIndex = y;
                        }
                    }

                    if (hasEligibleQuantity) {
                        var quantityAvailable = parseInt(eligibleWarehouses[x].itemsAllocatedInWarehouse[itemIndex].quantityAvailable);

                        nlapiLogExecution('DEBUG', 'quantityAvailable', quantityAvailable);

                        if (totalQuantity > 0) {
                            //warehousesToUse.push(eligibleWarehouses[x]);

                            eligibleWarehouses[x].itemsAllocatedInWarehouse[itemIndex].isEligible = true;

                            var quantityAvailed = 0;
                            if (totalQuantity >= quantityAvailable) {
                                quantityAvailed = quantityAvailable;
                            } else if (totalQuantity < quantityAvailable) {
                                quantityAvailed = totalQuantity;
                            }

                            eligibleWarehouses[x].itemsAllocatedInWarehouse[itemIndex].commitedQuantity = quantityAvailed;
                            eligibleWarehouses[x].itemsAllocatedInWarehouse[itemIndex].status = 'instock';
                            //lapiLogExecution('DEBUG', 'Warehouse ' + eligibleWarehouses[x].name + ' Quantity Avail + ' + quantityAvailed, 'Test');

                            totalQuantity = totalQuantity - quantityAvailable;
                        } else {

                            eligibleWarehouses[x].itemsAllocatedInWarehouse[itemIndex].isEligible = false;

                        }
                    }
                }


                if (totalQuantity > 0) {
                    nlapiLogExecution('DEBUG', 'Total Remaining Quantity not Mapped ' + itemId, totalQuantity);  
                    
                    // Only Greather than 1 since were getting the nearest warehouse
                    for (var l = 0; l < eligibleWarehouses.length; l++) {
                        var itemsOnWarehouse = eligibleWarehouses[l].itemsAllocatedInWarehouse;
                        var overrideFlag = false;

                        for (var y = 0; y < itemsOnWarehouse.length; y++) {
                            var itemIdOnWarehouse = itemsOnWarehouse[y].itemId;

                            if (itemIdOnWarehouse == itemId) {

                                var clonedItem = itemsOnWarehouse[y];

                                if (clonedItem.quantityAvailable > 0) {

                                    nlapiLogExecution('DEBUG', 'clonedItem' + itemId, JSON.stringify(clonedItem));  

                                    eligibleWarehouses[l].itemsAllocatedInWarehouse.push({
                                            "itemId": itemsOnWarehouse[y].itemId,
                                            "quantityOrder": itemsOnWarehouse[y].quantityOrder,
                                            "quantityAvailable": 0,
                                            "isEligible": true,
                                            "commitedQuantity": totalQuantity,
                                            "status": "backordered"
                                    });
                                } else {
                                    clonedItem.status = 'backordered';
                                }

                                overrideFlag = true;
                                break;
                            }
                        }

                        if (overrideFlag) break;
                    }

                    // {
                    //     "itemId": "8060",
                    //     "quantityOrder": 600,
                    //     "quantityAvailable": "100",
                    //     "isEligible": true,
                    //     "commitedQuantity": 100,
                    //     "status": "instock"
                    // }
                }

                

                //nlapiLogExecution('DEBUG', 'eligibleWarehouses for ' + itemId, JSON.stringify(eligibleWarehouses));
            }

            for (var k = 0; k < eligibleWarehouses.length; k++) {

                var itemsOnWarehouse = eligibleWarehouses[k].itemsAllocatedInWarehouse;

                var hasEligibleQuantity = false;

                for (var l = 0; l < itemsOnWarehouse.length; l++) {
                    var isEligible = itemsOnWarehouse[l].isEligible;

                    if (isEligible) {
                        hasEligibleQuantity = true;
                    }
                }

                if (hasEligibleQuantity) {
                    warehousesToUse.push(eligibleWarehouses[k]);
                }
            }

            //warehousesToUse = eligibleWarehouses;
        }

        return warehousesToUse;
    },

    _getAvailableStock: function(itemId) {
        try {

            var itemType = nlapiLookupField('item', itemId, 'recordtype');

            var resultsObject = [];
            var record = nlapiLoadRecord(itemType, itemId, []);
            var lineCount = record.getLineItemCount('locations');

            for (var i = 1; i <= lineCount; i++){
                var locationId = record.getLineItemValue('locations', 'location', i);

                var locationRecord = nlapiLoadRecord('location',locationId);
                var makeInventoryAvailableStore = locationRecord.getFieldValue('makeinventoryavailablestore');
                var parent = locationRecord.getFieldValue('parent');
                var subsidiary = locationRecord.getFieldValue('subsidiary');
                var address = locationRecord.getFieldValue('mainaddress_text');

                var indexOfAddressee = address.indexOf('\r\n');

                    address = address.substring(indexOfAddressee);
                    address = address.split(locationRecord.getFieldValue('name')).join('');
                    address = address.split('\r\n').join(' ');
                    address = address.trim();


                address = this._replaceCountryWithCountryCode(subsidiary, address);

                //nlapiLogExecution('DEBUG', 'formattedAddress', formattedAddress);

                if (parent == null && makeInventoryAvailableStore == 'T') {
                    var name = record.getLineItemValue('locations', 'location_display', i);
                    var quantityAvailable = record.getLineItemValue('locations', 'quantityavailable', i);

                    //var points = this._mapLocationDetailsToWarehouse(locationId, address);
                    var points = {latitude:0, longitude:0};

                    if (quantityAvailable > 0) {
                        resultsObject.push({
                            'name': name,
                            'quantityAvailable': quantityAvailable,
                            'locationId': locationId,
                            'itemId': itemId,

                            'address': address,
                            'latitude': (points.latitude == 0) ? locationRecord.getFieldValue('latitude') : -1,
                            'longitude': (points.longitude == 0) ? locationRecord.getFieldValue('longitude') : -1
                        });
                    }
                }

            }

            return resultsObject;

        } catch (e) {
            nlapiLogExecution('ERROR', 'Error on  Getting Item Location Details', e);
        }
    },

    _getNearestLocationFromCustomerToWarehouseByItemIds: function(items, customerAddress) {

        var warehouses = this._searchWarehousesByItemIds(items);

        nlapiLogExecution('DEBUG', 'warehouses', JSON.stringify(warehouses));

        var warehousesWithValidDistance = [];

        if (!customerAddress) {
            customerAddress = '2955 Campus Drive, Suite 250 San Mateo CA';
        }

        for (var x = 0; x < warehouses.length; x++) {
            var warehouseAddress = warehouses[x].address

            var record = this._getDistance(warehouseAddress, customerAddress);

            warehouses[x].distanceText = record.distance.text;
            warehouses[x].distanceValue = record.distance.value;

            if (warehouses[x].distanceValue > -1) {
                warehousesWithValidDistance.push(warehouses[x])
            }

            //nlapiLogExecution('DEBUG', 'warehouseAddress', warehouseAddress);
            //nlapiLogExecution('DEBUG', 'distance', JSON.stringify(record.distance));
        }

        warehousesWithValidDistance.sort(function(a, b) {
            return parseFloat(a.distanceValue) - parseFloat(b.distanceValue);
        });

        return warehousesWithValidDistance;
    },

    _getNearestLocationFromCustomerToWarehouse: function(customerAddress, itemId) {
        var warehouses = [];

        if (!itemId) {

        } else {
            warehouses = this._getAvailableStock(itemId);
        }


        nlapiLogExecution('DEBUG', 'warehouses', JSON.stringify(warehouses));

        var warehousesWithValidDistance = []

        if (!customerAddress) {
            customerAddress = '2955 Campus Drive, Suite 250 San Mateo CA';
        }

        for (var x = 0; x < warehouses.length; x++) {
            var warehouseAddress = warehouses[x].address

            var record = this._getDistance(warehouseAddress, customerAddress);

            warehouses[x].distanceText = record.distance.text;
            warehouses[x].distanceValue = record.distance.value;

            if (warehouses[x].distanceValue > -1) {
                warehousesWithValidDistance.push(warehouses[x])
            }

            //nlapiLogExecution('DEBUG', 'warehouseAddress', warehouseAddress);
            //nlapiLogExecution('DEBUG', 'distance', JSON.stringify(record.distance));
        }

        warehousesWithValidDistance.sort(function(a, b) {
            return parseFloat(a.distanceValue) - parseFloat(b.distanceValue);
        });

        return warehousesWithValidDistance;
    },

    _getDistance: function(origin, destination) {
        var apiKey = "AIzaSyDB0Kmo3FncN1hUpiCmXaO1UN7_YqP1sfM";

        var url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+origin+"&destinations="+destination+"&key="+apiKey;

        url = url.replace(/ /g,"+");

        var response = nlapiRequestURL(url).getBody();

        response = JSON.parse(response);

        var distance = {"text":"-1", "value": -1};

        if (response.status == 'OK') {

            if (response.rows[0].elements[0].status && response.rows[0].elements[0].status == 'OK') {
                distance = response.rows[0].elements[0].distance;
            }
        }

        return {distance:distance};
    },

    _getPoints: function(address) {
        var apiKey = "AIzaSyDB0Kmo3FncN1hUpiCmXaO1UN7_YqP1sfM";

        var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false&key="+apiKey;

        var response = nlapiRequestURL(url).getBody();

        response = JSON.parse(response);

        if (response.status == 'OK') {

            var lat = response.results[0].geometry.location.lat;

            var lng = response.results[0].geometry.location.lng;

            return {latitude:lat, longitude:lng};
        } else {
            return {latitude:0, longitude:0};
        }
    },

    _replaceCountryWithCountryCode: function(subsidiaryId, address) {
        var record = nlapiLoadRecord('subsidiary', subsidiaryId, []);

        var country = record.getFieldText('country');
        var edition = record.getFieldValue('edition');

        return address.split(country).join(edition)
    }

};


