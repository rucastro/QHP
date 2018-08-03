//generate Rate Request and returns JSON
function getRatepass(request, response) {
  //get parent record
  var result = [];
  var message = '';
  var batId = request.getParameter('batchid');
  var originZip = request.getParameter('originzip');
  var destinationZip = request.getParameter('destzip');
  var shipmentDate = request.getParameter('shipdate');
  var shipmentClass = request.getParameter('shipclass');
  var shipmentWeight = request.getParameter('shipweight');
  var profileCode = 'SC48R';
  var clientCode = 'SC489';
  //URL of end point
  var url = "http://ec2-52-33-148-2.us-west-2.compute.amazonaws.com/api/Rates?";
    url += "&originZip=" + originZip;
	url += "&orginCity=null";
    url += "&destinationZip=" + destinationZip;
	url += "&destinationCity=null";
    url += "&profileCode=" + profileCode;
    url += "&clientCode=" + clientCode;
    url += "&shipmentDate=" + shipmentDate;
  	url += "&weight=" + shipmentWeight;
  	url += "&shipmentClass=" + shipmentClass;
  	url += "&accessorials=" + 'null';
  	url += "&palletCount=" + 'null';

  nlapiLogExecution('DEBUG', 'GetRates', 'Send Request: ' + url);
  message = nlapiRequestURL(url); //calling the service
  var respobj = JSON.parse(message.getBody());

      
      //respobj = respobj.substring(1, respobj.length - 1);

    nlapiLogExecution('DEBUG', 'GetRates Response Stringify', JSON.stringify(respobj));

    nlapiLogExecution('DEBUG', 'GetRates Is Array or Object', isArray(respobj));

    var formattedResponse = {carrier:respobj[0].CarrierName, cost:respobj[0].TotalShipmentCost};

    nlapiLogExecution('DEBUG', 'formattedResponse', JSON.stringify(formattedResponse));

    if (isArray(respobj)) {
        result = formattedResponse;
    } else {
        result = {error: 'Error Response'};
    }

    response.write(JSON.stringify(result));

}

function isArray (value) {
    return value && typeof value === 'object' && value.constructor === Array;
}