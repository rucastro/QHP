/* eslint-disable */
this["Application"] = this["Application"] || {};
this["Application"]["templates"] = this["Application"]["templates"] || {};
this["Application"]["templates"]["hashtag-gallery"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "            <li><a data-action=\"refresh\" href=\"#\" class=\"pgBntG\">Refresh</a></li>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "            <li class=\"previous "
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.hasPrevious : depth0),{"name":"unless","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\"><a data-action=\"prev\" href=\"#\" class=\"pgBntG\"><span aria-hidden=\"true\">&larr;</span>Newer</a></li>\n";
},"4":function(depth0,helpers,partials,data) {
    return "disabled";
},"6":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    <div class=\"col-md-3\">\n        <div class=\"thumbnail "
    + alias3(((helper = (helper = helpers.statusClass || (depth0 != null ? depth0.statusClass : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusClass","hash":{},"data":data}) : helper)))
    + "\">\n            <p class=\""
    + alias3(((helper = (helper = helpers.statusClass || (depth0 != null ? depth0.statusClass : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusClass","hash":{},"data":data}) : helper)))
    + " hashtag-status-icon\"><img src=\""
    + alias3(((helper = (helper = helpers.statusImg || (depth0 != null ? depth0.statusImg : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusImg","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + alias3(((helper = (helper = helpers.statusText || (depth0 != null ? depth0.statusText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusText","hash":{},"data":data}) : helper)))
    + "\"></p>\n            <img src=\""
    + alias3(((helper = (helper = helpers.thumbnailAssetUrl || (depth0 != null ? depth0.thumbnailAssetUrl : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"thumbnailAssetUrl","hash":{},"data":data}) : helper)))
    + "\" alt=\"\" data-toggle=\"modal\" data-target=\"#modal-"
    + alias3(((helper = (helper = helpers.externalid || (depth0 != null ? depth0.externalid : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"externalid","hash":{},"data":data}) : helper)))
    + "\">\n            <div class=\"caption "
    + alias3(((helper = (helper = helpers.statusClass || (depth0 != null ? depth0.statusClass : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusClass","hash":{},"data":data}) : helper)))
    + "\">\n                <h5>"
    + alias3(((helper = (helper = helpers.userName || (depth0 != null ? depth0.userName : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"userName","hash":{},"data":data}) : helper)))
    + "</h5>\n                <!-- <p class=\""
    + alias3(((helper = (helper = helpers.statusClass || (depth0 != null ? depth0.statusClass : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusClass","hash":{},"data":data}) : helper)))
    + "\"><img src=\""
    + alias3(((helper = (helper = helpers.statusImg || (depth0 != null ? depth0.statusImg : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusImg","hash":{},"data":data}) : helper)))
    + "\" alt=\""
    + alias3(((helper = (helper = helpers.statusText || (depth0 != null ? depth0.statusText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusText","hash":{},"data":data}) : helper)))
    + "\"> "
    + alias3(((helper = (helper = helpers.statusText || (depth0 != null ? depth0.statusText : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"statusText","hash":{},"data":data}) : helper)))
    + "</p> -->\n                <!--<p class=\"thumb-caption\">"
    + ((stack1 = ((helper = (helper = helpers.caption || (depth0 != null ? depth0.caption : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"caption","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</p>-->\n                <a href=\"#\" type=\"button\" data-toggle=\"modal\" data-target=\"#modal-"
    + alias3(((helper = (helper = helpers.externalid || (depth0 != null ? depth0.externalid : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"externalid","hash":{},"data":data}) : helper)))
    + "\">\n                    View Details\n                </a>\n                <p>\n                    <a href=\"#\"\n                       data-internalid=\""
    + alias3(((helper = (helper = helpers.internalid || (depth0 != null ? depth0.internalid : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"internalid","hash":{},"data":data}) : helper)))
    + "\"\n                       data-externalid=\""
    + alias3(((helper = (helper = helpers.externalid || (depth0 != null ? depth0.externalid : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"externalid","hash":{},"data":data}) : helper)))
    + "\"\n                       data-action=\"reject\"\n                       class=\"hashtag-action-button pgBntG hashtag-rejected "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isRejected : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\"\n                       role=\"button\">Reject\n                    </a>\n                    <a href=\"#\"\n                       data-internalid=\""
    + alias3(((helper = (helper = helpers.internalid || (depth0 != null ? depth0.internalid : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"internalid","hash":{},"data":data}) : helper)))
    + "\"\n                       data-externalid=\""
    + alias3(((helper = (helper = helpers.externalid || (depth0 != null ? depth0.externalid : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"externalid","hash":{},"data":data}) : helper)))
    + "\"\n                       data-action=\"approve\"\n                       class=\"hashtag-action-button pgBntB hashtag-approved "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isApproved : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\"\n                       role=\"button\">Publish\n                    </a>\n                </p>\n            </div>\n        </div><!-- end .thumbnail -->\n\n        <div class=\"modal fade\" id=\"modal-"
    + alias3(((helper = (helper = helpers.externalid || (depth0 != null ? depth0.externalid : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"externalid","hash":{},"data":data}) : helper)))
    + "\">\n            <div class=\"modal-dialog\">\n                <div class=\"modal-content\">\n                    <div class=\"modal-header\">\n                        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n                        <h5 class=\"modal-title\">Post by: "
    + alias3(((helper = (helper = helpers.userName || (depth0 != null ? depth0.userName : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"userName","hash":{},"data":data}) : helper)))
    + " <small> ("
    + alias3(((helper = (helper = helpers.userFullName || (depth0 != null ? depth0.userFullName : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"userFullName","hash":{},"data":data}) : helper)))
    + ")</small></h5>\n                        <p><b>Date: </b>"
    + alias3(((helper = (helper = helpers.createdDate || (depth0 != null ? depth0.createdDate : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"createdDate","hash":{},"data":data}) : helper)))
    + "</p>\n                        <p><b>Link: </b><a href=\""
    + alias3(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"link","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\">"
    + alias3(((helper = (helper = helpers.link || (depth0 != null ? depth0.link : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"link","hash":{},"data":data}) : helper)))
    + "</a></p>\n                    </div>\n                    <div class=\"modal-body\">\n                        <img class=\"img-responsive\" src=\""
    + alias3(((helper = (helper = helpers.assetUrl || (depth0 != null ? depth0.assetUrl : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"assetUrl","hash":{},"data":data}) : helper)))
    + "\">\n                        <p class=\"hashtag-comment\">"
    + alias3(((helper = (helper = helpers.caption || (depth0 != null ? depth0.caption : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"caption","hash":{},"data":data}) : helper)))
    + "</p>\n                    </div>\n                </div><!-- /.modal-content -->\n            </div><!-- /.modal-dialog -->\n        </div>\n    </div>\n";
},"8":function(depth0,helpers,partials,data) {
    return "            <li class=\"\"><a data-action=\"refresh\" href=\"#\" class=\"pgBntG\"><span aria-hidden=\"true\">&larr;</span>Refresh</a></li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<h3>Hashtag: "
    + alias3(((helper = (helper = helpers.hashtag || (depth0 != null ? depth0.hashtag : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"hashtag","hash":{},"data":data}) : helper)))
    + " - <small> "
    + alias3(((helper = (helper = helpers.count || (depth0 != null ? depth0.count : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"count","hash":{},"data":data}) : helper)))
    + " result(s) </small></h3>\n<ul class=\"color-code\">\n    <li><img src=\""
    + alias3(((helper = (helper = helpers.assetsPath || (depth0 != null ? depth0.assetsPath : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"assetsPath","hash":{},"data":data}) : helper)))
    + "img/hashtag_image_approved_small.png\" alt=\"Published\">Published</li>\n    <li><img src=\""
    + alias3(((helper = (helper = helpers.assetsPath || (depth0 != null ? depth0.assetsPath : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"assetsPath","hash":{},"data":data}) : helper)))
    + "img/hashtag_image_rejected_small.png\" alt=\"Rjeceted\">Rejected</li>\n    <li><img src=\""
    + alias3(((helper = (helper = helpers.assetsPath || (depth0 != null ? depth0.assetsPath : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"assetsPath","hash":{},"data":data}) : helper)))
    + "img/hashtag_image_error_small.png\" alt=\"Pending Review\">Pending Review</li>\n</ul>\n<nav>\n    <ul class=\"pager\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasRefresh : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasPrevious : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <li class=\"next "
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.hasNext : depth0),{"name":"unless","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\"><a data-action=\"next\" href=\"#\" class=\"pgBntG\">Older <span aria-hidden=\"true\">&rarr;</span></a></li>\n    </ul>\n</nav>\n<div class=\"row\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n<nav>\n    <ul class=\"pager\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasRefresh : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasPrevious : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        <li class=\"next "
    + ((stack1 = helpers.unless.call(depth0,(depth0 != null ? depth0.hasNext : depth0),{"name":"unless","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\"><a data-action=\"next\" href=\"#\" class=\"pgBntG\">Older <span aria-hidden=\"true\">&rarr;</span></a></li>\n    </ul>\n</nav>\n";
},"useData":true});
this["Application"]["templates"]["hashtag-list"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    <a class=\"list-group-item "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.active : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\" href=\"#/hashtag/"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "/\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"2":function(depth0,helpers,partials,data) {
    return "active";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"input-group-lg\">\n    <h4>Search Social Hashtag</h4>\n    <div class=\"input-group stylish-input-group\">\n        <form id=\"search-hashtag\">\n            <input type=\"text\" class=\"form-control\" data-filter=\"hashtag\" placeholder=\"Search\" value=\""
    + this.escapeExpression(((helper = (helper = helpers.hashtagSearch || (depth0 != null ? depth0.hashtagSearch : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"hashtagSearch","hash":{},"data":data}) : helper)))
    + "\" >\n            <span class=\"input-group-addon pgBntB\">\n                <button type=\"submit\" id=\"input-hashtag-btn\">Search</button>\n            </span>\n        </form>\n    </div>\n</div>\n<div class=\"list-group doubt-style\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.hashtags : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});
this["Application"]["templates"]["home"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<h2>Social Hashtag Gallery</h2>\n\n\n<p>Grabs images matching any hashtag from social APIs like instagram. Stores image url & details locally for each one in a custom record type so you have full control over the content on your site. This allows you to publish/unpublish, and include them any way that you like on your pages.</p>\n<ol>\n	<li>Use the Search bar in the left column to search for your hashtags. (You must have created the hashtag record first)</li>\n	<li>Search Results mapping your hashtag will be displayed.</li>\n	<li>Publish or Reject images</li>\n	<li>Published images will show up automatically on any page using that hashtag.</li>\n</ol>";
},"useData":true})
/* eslint-enable */
