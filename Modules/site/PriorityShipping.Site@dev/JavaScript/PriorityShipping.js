define('PriorityShipping', [
    'PriorityShipping.Model'
], function PriorityShipping (
    PriorityShippingModel

) {
    'use strict';

    return {

        mountToApp: function () {
            //console.log('PriorityShipping Module Added');
            /**
                batchid = I just use a Date.now() function to generate a time stamp for the rate passes.

                originzip = zip code of the location the items are being shipped from.

                destzip = zip code of the currently logged in customer.

                shipdate = the date format here is MM/DD/YYYY - I normally pull the Sales Order date,
                            but in this particular situation I would just use the current date.

                shipclass = this is expecting an integer that will be present on the item record.
                            Examples of freight classes are 60, 65, 75, 125, etc....

                shipweight = this is expecting the total shipment weight as a whole integer.
            **/


            // var priorityShippingModel = new PriorityShippingModel();
            // var promise = priorityShippingModel.fetch({
            //         data: {
            //             batchid: new Date(),
            //             originzip: 92093,
            //             destzip: 92129,
            //             shipdate: '04/30/2018',
            //             shipclass: 60,
            //             shipweight: 100
            //         }
            //     });
            //     promise.done(function(){
            //         console.log('priorityShippingModel', priorityShippingModel);
            //     });

        }
    }
});