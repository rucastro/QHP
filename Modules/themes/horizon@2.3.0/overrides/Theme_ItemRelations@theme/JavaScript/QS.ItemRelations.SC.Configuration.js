

 /*
* Copyright NetSuite, Inc. 2015 All rights reserved.
* The following code is a demo prototype. Due to time constraints of a demo,
* the code may contain bugs, may not accurately reflect user requirements
* and may not be the best approach. Actual implementation should not reuse
* this code without due verification.

* @Author: mgaricoits
* @Date:   12/5/16
* @Edited: heaston
*/

define('QS.ItemRelations.SC.Configuration', [
    'SC.Configuration'
],
function QSItemRelations() {
    'use strict';

    return {
        mountToApp: function mountToApp() {
            if (SC.CONFIGURATION.bxSliderDefaults && SC.CONFIGURATION.bxSliderDefaults.slideWidth) {
                SC.CONFIGURATION.bxSliderDefaults.slideWidth = 533;
                SC.CONFIGURATION.bxSliderDefaults.maxSlides = 3;
            }
        }
    };
});
