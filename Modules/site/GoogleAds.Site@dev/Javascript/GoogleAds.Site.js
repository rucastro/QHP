/**
 * Created by ammann on 4/17/17.
 */

/* eslint-disable */
//Because this is a pre-denali module and throwing a bunch of errors
define('GoogleAds.Site', [
    'jQuery'
], function (
    jQuery
) {
    return {
        mountToApp: function (application) {
            if (!SC.isPageGenerator()) {
                var Layout = application.getLayout();
                
                Layout.once('afterAppendView', function (v) {
                    var len = $('script[src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]').length;
                    if(len === 0) {
                        jQuery.getScript("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", function(){
                            (adsbygoogle = window.adsbygoogle || []).push({
                                google_ad_client: "ca-pub-8724235939512556",
                                enable_page_level_ads: true
                            });
                        });
                    }
                });
            }
        }
    };
});
