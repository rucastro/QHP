/* eslint-disable */
describe('Back In Stock Test Automation', function()
{
    it ('Should Dispay Button if product is out of stock and load the form', function(done)
    {
        var client = this.client;
        client
            .url('http://backinstock.dev1.efficiencies.production.netsuitestaging.com/Mecca-Shorts_2?custcol1=2&custcol2=1')
            .waitForAjax()
            .pause(1000)
            .waitForAjax()
            .getText('.item-views-stock-msg-out', function(err, text) {
                if (text) {
                    client
                        .getText('.back-in-stock-notification-show-form-button', function(err, btnText) {
                            expect(btnText).not.toBe(undefined);
                        })
                        .click('.back-in-stock-notification-show-form-button')
                        .pause(2000)
                        .waitForAjax()
                        .getText('.back-in-stock-notification-submit-button', function(err, formText) {
                            expect(formText).not.toBe(undefined);
                        })
                    ;
                }
            })
            .pause(5000)
            .call(done)
        ;
    });
})
/* eslint-enable */
