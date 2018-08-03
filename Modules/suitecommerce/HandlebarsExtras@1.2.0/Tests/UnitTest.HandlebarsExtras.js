/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/


// the following is the compiled template for :
// this is a handlebars template 1 {{#each list}} name:{{name}} {{@first}} {{@last}} {{@index}} {{/each}}

define('handlebars_each_test1.tpl', ['Handlebars'], function(Handlebars){ return Handlebars.template({"1":function(depth0,helpers,partials,data) {
	var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
	return " name:"
		+ escapeExpression(((helper = (helper = ((typeof(Backbone)!="undefined" && helpers instanceof Backbone.Model) ? helpers.get("name") : helpers.name) || (depth0 != null ? ((typeof(Backbone)!="undefined" && depth0 instanceof Backbone.Model) ? depth0.get("name") : depth0.name) : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
		+ " "
		+ escapeExpression(lambda((data && ((typeof(Backbone)!="undefined" && data instanceof Backbone.Model) ? data.get("first") : data.first)), depth0))
		+ " "
		+ escapeExpression(lambda((data && ((typeof(Backbone)!="undefined" && data instanceof Backbone.Model) ? data.get("last") : data.last)), depth0))
		+ " "
		+ escapeExpression(lambda((data && ((typeof(Backbone)!="undefined" && data instanceof Backbone.Model) ? data.get("index") : data.index)), depth0))
		+ " ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
	var stack1, buffer = "this is a handlebars template 1 ";
	stack1 = ((typeof(Backbone)!="undefined" && helpers instanceof Backbone.Model) ? helpers.get("each") : helpers.each).call(depth0, (depth0 != null ? ((typeof(Backbone)!="undefined" && depth0 instanceof Backbone.Model) ? depth0.get("list") : depth0.list) : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
	if (stack1 != null) { buffer += stack1; }
	return buffer;
},"useData":true});});


define(['Handlebars', 'HandlebarsExtras', 'handlebars_each_test1.tpl', 'UnitTestHelper.Preconditions'], 
	function (Handlebars, HandlebarsExtras, handlebars_each_test1_tpl, Preconditions)
{
	'use strict';



	return describe('HandlebarsExtras', function ()
	{
		it('each should support @index @last and @first', function ()
		{
			window.SC = Preconditions.deepExtend(window.SC || {}, {
				ENVIRONMENT: {
					baseUrl: ''
				,	siteSettings: {}
				}
			,	isPageGenerator: function()
				{
					return true;
				}
			});

			var html = handlebars_each_test1_tpl({list:[{name:'seba'},{name:'andres'}]}); 

			expect(html).toBe('this is a handlebars template 1  name:seba true false 0  name:andres false true 1 ')

		});


		//TODO: test all the other helpers and compiler extension for BB models
	});
}); 

