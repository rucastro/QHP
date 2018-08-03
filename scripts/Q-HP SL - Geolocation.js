var Geolocation = {

    initialize: function(request, response) {
        var result = [];

        switch (request.getMethod()) {
            case 'GET':
                var requestType = request.getParameter('requestType') || null;
                var address = request.getParameter('address') || null;
                var origin = request.getParameter('origin') || null;
                var destination = request.getParameter('destination') || null;

                var addressId = request.getParameter('addressId') || null;
                var customerId = request.getParameter('customerId') || null;

                nlapiLogExecution('DEBUG', 'requestType', requestType);
                nlapiLogExecution('DEBUG', 'address', address);
                nlapiLogExecution('DEBUG', 'origin', origin);
                nlapiLogExecution('DEBUG', 'destination', destination);
                nlapiLogExecution('DEBUG', 'addressId', addressId);
                nlapiLogExecution('DEBUG', 'customerId', customerId);

                if (requestType == 'getPoints') {
                    result = this._getPoints(address);

                    if (addressId && result) {

                        nlapiLogExecution('DEBUG', 'latitude', result.latitude);
                        nlapiLogExecution('DEBUG', 'longitude', result.longitude);

                        this._attachPointsToAddress(customerId, addressId, result.latitude, result.longitude);
                    }
                } else if (requestType == 'getDistance') {
                    result = this._getDistance(origin, destination);
                } else {
                    result = {message:"No Parameters"};
                }
                break;
        }

        response.write(JSON.stringify(result));
    },

    _getPoints: function(address) {
        var apiKey = "AIzaSyDB0Kmo3FncN1hUpiCmXaO1UN7_YqP1sfM";

        var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false&key="+apiKey;

        //url = url.replace(/ /g,"+");

        var response = nlapiRequestURL(url).getBody();

        response = JSON.parse(response);

        if (response.status == 'OK') {
            nlapiLogExecution('DEBUG', 'response', JSON.stringify(response));

            var lat = response.results[0].geometry.location.lat;

            var lng = response.results[0].geometry.location.lng;

            return {latitude:lat, longitude:lng};
        } else {
            return {latitude:0, longitude:0};
        }


    },

    _getDistance: function(origin, destination) {
        var apiKey = "AIzaSyDB0Kmo3FncN1hUpiCmXaO1UN7_YqP1sfM";

        var url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+origin+"&destinations="+destination+"&key="+apiKey;

        url = url.replace(/ /g,"+");

        var response = nlapiRequestURL(url).getBody();

        response = JSON.parse(response);

        var distance = response.rows[0].elements[0].distance;

        return {distance:distance};
    },

    _attachPointsToAddress: function(customerId, addressId, latitude, longitude) {

        var record = nlapiLoadRecord('customer', customerId, {recordmode: 'dynamic'});

        var addressCount = record.getLineItemCount('addressbook');

        for (var x = 1; x <= addressCount; x++) {

            var id = record.getLineItemValue('addressbook', 'internalid', x);

            if (id == addressId) {
                record.selectLineItem('addressbook', x);

                var subRecord = record.editCurrentLineItemSubrecord('addressbook', 'addressbookaddress');

                    subRecord.setFieldValue('custrecord_qhp_latitude', latitude);
                    subRecord.setFieldValue('custrecord_qhp_longitude', longitude);
                    subRecord.commit();

                record.commitLineItem('addressbook');
            }

        }

        nlapiSubmitRecord(record)
    }

};


