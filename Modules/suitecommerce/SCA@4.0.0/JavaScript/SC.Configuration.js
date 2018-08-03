/*
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module SC
// @class SC.Configuration
// This class is responsible of creating the front end SC.Configuration object from the properties bootstrapped in SC.CONFIGURATION from backend. Also it does some properties post processing.

define(
	'SC.Configuration'
,	[
		'product_views_option_radio.tpl'
	,	'product_views_option_tile.tpl'
	,	'product_views_option_text.tpl'
	,	'product_views_option_color.tpl'
	,	'product_views_option_dropdown.tpl'

	,	'product_views_option_facets_color.tpl'
	,	'product_views_option_facets_tile.tpl'

	,	'transaction_line_views_selected_option.tpl'
	,	'transaction_line_views_selected_option_color.tpl'

	,	'underscore'
	,	'jQuery'
	,	'Utils'

	]
,	function (
		product_views_option_radio_tpl
	,	product_views_option_tile_tpl
	,	product_views_option_text_tpl
	,	product_views_option_color_tpl
	,	product_views_option_dropdown_tpl

	,	product_views_option_facets_color_tpl
	,	product_views_option_facets_tile_tpl

	,	transaction_line_views_selected_option_tpl
	,	transaction_line_views_selected_option_color_tpl

	,	_
	,	jQuery
	,	Utils

	)
{

	'use strict';

	var baseConfiguration = SC.CONFIGURATION || {};


	baseConfiguration.ItemOptions = baseConfiguration.ItemOptions || {};

	baseConfiguration.ItemOptions.defaultTemplates = baseConfiguration.ItemOptions.defaultTemplates || {
// 		//@class ItemOptions.DefaultTemplates
// 			//@property {DefaultOptionTemplateSpecification} selectorByType
// 			// each apply to specific item option types
			selectorByType:	{
				select: product_views_option_tile_tpl
			,	'default': product_views_option_text_tpl
			}
// 			// for rendering selected options in the shopping cart
		,	selectedByType: {
				'default': transaction_line_views_selected_option_tpl
		}
		,	facetCellByType: {
				'default': product_views_option_facets_color_tpl
			}
		};

	var item_option_templates = {
		'transaction_line_views_selected_option_color.tpl': transaction_line_views_selected_option_color_tpl
	,	'transaction_line_views_selected_option.tpl': transaction_line_views_selected_option_tpl

	,	'product_views_option_color.tpl': product_views_option_color_tpl
	,	'product_views_option_dropdown.tpl': product_views_option_dropdown_tpl
	,	'product_views_option_radio.tpl': product_views_option_radio_tpl
	,	'product_views_option_text.tpl': product_views_option_text_tpl
	,	'product_views_option_tile.tpl': product_views_option_tile_tpl

	,	'product_views_option_facets_color.tpl': product_views_option_facets_color_tpl
	,	'product_views_option_facets_tile.tpl': product_views_option_facets_tile_tpl
	};

	_.each(baseConfiguration.ItemOptions.optionsConfiguration || [], function (item_option)
	{
		if (item_option.templateSelected && item_option_templates[item_option.templateSelected])
		{
			item_option.templates = item_option.templates || {};
			item_option.templates.selected = item_option_templates[item_option.templateSelected];
		}

		if (item_option.templateSelector && item_option_templates[item_option.templateSelector])
		{
			item_option.templates = item_option.templates || {};
			item_option.templates.selector = item_option_templates[item_option.templateSelector];
		}

		if (item_option.templateFacetCell && item_option_templates[item_option.templateFacetCell])
		{
			item_option.templates = item_option.templates || {};
			item_option.templates.facetCell = item_option_templates[item_option.templateFacetCell];
		}
	});



	var Configuration = {

		searchPrefs:
		{
			// Keyword formatter function will format the text entered by the user in the search box. This default implementation will remove invalid keyword characters like *()+-="
			keywordsFormatter: function (keywords)
			{
				if (keywords === '||')
				{
					return '';
				}
//Removed \" and \/ regex expressions for hotfix on searchtypeahead, patchin future
				var anyLocationRegex = /[\(\)\[\]\{\~\}\!\:]{1}/g // characters that cannot appear at any location
				,	beginingRegex = /^[\#\*\-\+]{1}/g // characters that cannot appear at the begining
				,	replaceWith = ''; // replacement for invalid chars

				return keywords.replace(anyLocationRegex, replaceWith).replace(beginingRegex, replaceWith);
			}
		}

	// 	//@property {ItemOptions} ItemOptions
	// ,	ItemOptionsFAKE: {
	// 		//@class ItemOptions
	// 		//@property {Number} maximumOptionValuesQuantityWithoutPusher Indicate the number maximum of option's values (this mean that if you have 2 dimensions and each have 3 values you
	// 		// will have 6 values in total) that will shown on a mobile PDP inline.
	// 		//If an item has more than maximumOptionValuesQuantityWithoutPusher options the options will be rendered in a pusher IN MOBILE .
	// 		maximumOptionValuesQuantityWithoutPusher: 8

	// 		//@property {ItemOptions.DefaultTemplates} defaultTemplates Configure the default option's templates when a selection of an options,
	// 		//a read-only option is shown and when an option is shown in the list of items (facet search)

	// 		//@class ItemOptions
	// 		// @property {Array<ItemOption>} optionsConfiguration Settings for displaying each of the item options in the Detailed Page
	// 		// Each of the item options are objects that extend what's coming of the search API
	// 		// This options should have (but not limited to) these documented properties
	// 		// We have provided some templates for you to use but you are encouraged to create your own:
	// 		// For the selector (select/edit an option) we have created:
	// 		// * product_views_option_color_tpl
	// 		// * product_views_option_text_tpl
	// 		//
	// 		// and for the selected (read-only) we have created:
	// 		// * transaction_line_views_selected_option_tpl
	// 		// * transaction_line_views_selected_option_color_tpl
	// 		//
	// 		// Please notice that all templates the module Transaction.Line.Details are designed to edit and select options, whereas templates from the
	// 		// module Transaction.Line.Views are designed are read-only to show selected options
	// 		//
	// 		// @class ItemOption
	// 		// @property {String} itemOptionId The id of an option in the item
	// 		// @property {String} cartOptionId The id of an option in the cart (!required, is the primary key for the mapping)
	// 		// @property {String} label The label that the option will be shown
	// 		// @property {Number?} index Optional number to sort options. Default value: 10
	// 		// @property {String} urlParameterName the key of the option when its stored in the url
	// 		// @property {Boolean} useLabelsOnUrl Indicate if label will be used in when generating the url instead of the option's value internalid
	// 		// @property {selector:Function,selected:Function,facetCell:Function} templates An object that contains
	// 		//   'selector' is the template that will be rendered for selecting the options (Item list and PDP)
	// 		//   'selected' is the template that will be rendered for the item in the cart (Cart and Cart confirmation)
	// 		// @property {Boolean} showSelectorInList if true the selector will be rendered in the item list
	// 		// @property {Array<Color.Configuration>|Array<String>} colors A map of the label of the color as they key and hexa or an object as the value is required by the itemDetailsOptionColor
	// 		// @class Color.Configuration This class configure the colors used by transaction_line_details_option_color.tpl template
	// 		// @property {String} src
	// 		// @property {String} width The value set here will be used as the value of width property of the img tag
	// 		// @property {String} height The value set here will be used as the value of width property of the img tag
	// 		// @class SCA.Shopping.Configuration
	// 	,	optionsConfiguration: [
	// 		// Here are some examples:
	// 		// configure a color option to use color template
	// 			{
	// 				cartOptionId: 'custcol1'
	// 			,	label: _('Color').translate()
	// 			,	urlParameterName: 'color'
	// 			// ,	colors: colors
	// 			,	showSelectorInList: false
	// 			,	templates: {
	// 					selector: product_views_option_color_tpl // PDP
	// 				,	selected: transaction_line_views_selected_option_color_tpl //my account
	// 				,	facetCell: product_views_option_facets_color_tpl //facets
	// 				}
	// 			}

	// 		// configure Gift Certificates options to change the value on the url
	// 		// when the user is filling the values
	// 		,	{
	// 				cartOptionId: 'GIFTCERTFROM'
	// 			,	urlParameterName: 'from'
	// 			}
	// 		,	{
	// 				cartOptionId: 'GIFTCERTRECIPIENTNAME'
	// 			,	urlParameterName: 'to'
	// 			}
	// 		,	{
	// 				cartOptionId: 'GIFTCERTRECIPIENTEMAIL'
	// 			,	urlParameterName: 'to-email'
	// 			}
	// 		,	{
	// 				cartOptionId: 'GIFTCERTMESSAGE'
	// 			,	urlParameterName: 'message'
	// 			}
	// 		]
	// 	}

	// 	// @property {closable:Boolean,saveInCookie:Boolean,anchorText:String,message:String} cookieWarningBanner
	// 	// settings for the cookie warning message (mandatory for UK stores)
	// ,	cookieWarningBanner: {
	// 		closable: true
	// 	,	saveInCookie: true
	// 	,	anchorText: _('Learn More').translate()
	// 	,	message: _('To provide a better shopping experience, our website uses cookies. Continuing use of the site implies consent.').translate()
	// 	}

		// @class SCA.Shopping.Configuration
		// @property {betweenFacetNameAndValue:String,betweenDifferentFacets:String,betweenDifferentFacetsValues:String,betweenRangeFacetsValues:String,betweenFacetsAndOptions:String,betweenOptionNameAndValue:String,betweenDifferentOptions:String}
	// ,	facetDelimiters: {
	// 		betweenFacetNameAndValue: '/'
	// 	,	betweenDifferentFacets: '/'
	// 	,	betweenDifferentFacetsValues: ','
	// 	,	betweenRangeFacetsValues: 'to'
	// 	,	betweenFacetsAndOptions: '?'
	// 	,	betweenOptionNameAndValue: '='
	// 	,	betweenDifferentOptions: '&'
	// 	}
		// Output example: /brand/GT/style/Race,Street?display=table

		// Output example: brand-GT/style-Race|Street~display/table

	// 	// @param {Object} searchApiMasterOptions options to be passed when querying the Search API
	// ,	searchApiMasterOptions: {

	// 		Facets: {
	// 			include: 'facets'
	// 		,	fieldset: 'search'
	// 		}

	// 	,	itemDetails: {
	// 			include: 'facets'
	// 		,	fieldset: 'details'
	// 		}

	// 	,	relatedItems: {
	// 			fieldset: 'relateditems_details'
	// 		}

	// 	,	correlatedItems: {
	// 			fieldset: 'correlateditems_details'
	// 		}

	// 		// don't remove, get extended
	// 	,	merchandisingZone: {}

	// 	,	typeAhead: {
	// 			fieldset: 'typeahead'
	// 		}

	// 	,	itemsSearcher: {
	// 			fieldset: 'itemssearcher'
	// 		}
	// 	}

	// 	// @property {#obj(minLength: Number, maxResults: Number, macro: String, sort: String)} typeahead Typeahead Settings
	// ,	typeahead: {
	// 		minLength: 3
	// 	,	maxResults: 4
	// 	,	macro: 'typeahead'
	// 	,	sort: 'relevance:asc'
	// 	}



	,	bxSliderDefaults: {
			minSlides: 2
		,	slideWidth: 228
		,	maxSlides: 5
		,	forceStart: true
		,	pager: false
		,	touchEnabled:true
		,	nextText: '<a class="item-relations-related-carousel-next"><span class="control-text">' + _('next').translate() + '</span> <i class="carousel-next-arrow"></i></a>'
		,	prevText: '<a class="item-relations-related-carousel-prev"><i class="carousel-prev-arrow"></i> <span class="control-text">' + _('prev').translate() + '</span></a>'
		,	controls: true
		,	preloadImages: 'all'
		}

	,	siteSettings: SC && SC.ENVIRONMENT && SC.ENVIRONMENT.siteSettings || {}

	,	get: function (path, defaultValue)
		{
			return _.getPathFromObject(this, path, defaultValue);
		}

		//TODO: move this method to another file
	,	getRegistrationType: function ()
		{
    		//registrationmandatory is 'T' when customer registration is disabled
			if (Configuration.get('siteSettings.registration.registrationmandatory') === 'T')
			{
				// no login, no register, checkout as guest only
				return 'disabled';
			}
			else
			{
				if (Configuration.get('siteSettings.registration.registrationoptional') === 'T')
				{
					// login, register, guest
					return 'optional';
				}
				else
				{
					if (Configuration.get('siteSettings.registration.registrationallowed') === 'T')
					{
						// login, register, no guest
						return 'required';
					}
					else
					{
						// login, no register, no guest
						return 'existing';
					}
				}
			}
		}


	};

	// Deep extend
	// TODO: according to the manifest, some properties need to be translated
	jQuery.extend(true, baseConfiguration, Configuration);

	//BACKWARDS COMPATIBILITY: all the following is a normalization to the object baseConfiguration to guarantee backguard compatibility with pre montblanc in the sense of configuration property names in application.getConfig('foo')

	//fixing some properties for backward compatibility w montblanc:
	var imageSizeMapping = {};

	_.each(baseConfiguration.imageSizeMapping, function(item)
	{
		imageSizeMapping[item.id] = item.value;
	});

	baseConfiguration.imageSizeMapping = imageSizeMapping;

	var searchApiMasterOptions = {};

	_.each(baseConfiguration.searchApiMasterOptions, function(item)
	{
		searchApiMasterOptions[item.id] = {
			fieldset: item.fieldset
		,	include: item.include
		};
	});

	baseConfiguration.searchApiMasterOptions = searchApiMasterOptions;
	//social sharing backward compatibility

	var addThisOptions = {};

	_.each(baseConfiguration.addThis && baseConfiguration.addThis.options, function(item)
	{
		addThisOptions[item.key] = item.value;
	});

	

	baseConfiguration.addThis && (baseConfiguration.addThis.options = addThisOptions);

	var addThisServicesToShow = {};

	_.each(baseConfiguration.addThis && baseConfiguration.addThis.servicesToShow, function(item)
	{
		addThisServicesToShow[item.key] = item.value;
	});

	baseConfiguration.addThis && (baseConfiguration.addThis.servicesToShow = addThisServicesToShow);

	_.each(baseConfiguration.paymentmethods, function (item)
	{
		try
		{
			if (item.regex)
			{
				item.regex = new RegExp(item.regex);
			}

		}
		catch (ex)
		{

		}
	});

	if (baseConfiguration.productReviews && baseConfiguration.productReviews.sortOptions)
	{
		_.each(baseConfiguration.productReviews.sortOptions, function (sortOptions)
		{
			try
			{
				sortOptions.params = JSON.parse(sortOptions.params || '{}') || {};
			}
			catch (ex)
			{

			}
		});
	}
	if (baseConfiguration.productReviews && baseConfiguration.productReviews.filterOptions)
	{
		_.each(baseConfiguration.productReviews.filterOptions, function (filterOptions)
		{
			try
			{
				filterOptions.params = JSON.parse(filterOptions.params || '{}') || {};
			}
			catch (ex)
			{

			}
		});
	}

	//extraTranslations
	var currentLocale = SC && SC.ENVIRONMENT && SC.ENVIRONMENT.currentLanguage && SC.ENVIRONMENT.currentLanguage.locale;
	_.each(baseConfiguration.extraTranslations, function (item)
	{
		if (item[currentLocale])
		{
			SC.Translations[item.key] = item[currentLocale];
		}
	});

	//navigation data
	baseConfiguration.navigationData = baseConfiguration.navigationData || [];

	// navigation hierarchy bindings.
	_.each(baseConfiguration.navigationData, function (entry)
	{
		if (!entry)
		{
			return;
		}
		else
		{
			if(entry.placeholder)
			{
				entry.text = '';
			}
			entry['class'] = 'header-menu-level' + entry.level + '-anchor';
		}
		if (entry.parentId)
		{
			var parent = _.find(baseConfiguration.navigationData, function (e)
			{
				return e.id===entry.parentId;
			});
			parent = parent || {};
			parent.categories = parent.categories || [];
			parent.categories.push(entry);
		}
		if (entry.classnames)
		{
			entry['class'] += ' ' + entry.classnames;
		}
	});

	// Now, remove  non top level nav entries from the array (root nodes)
	// heads up ! we have to re-iterate :( this is the correct way of deleting and iterating an array - not _.each()
	for (var i = 0; i < baseConfiguration.navigationData.length; i++)
	{
		var entry = baseConfiguration.navigationData[i];
		if (!entry || entry.level > 1)
		{
			baseConfiguration.navigationData.splice(i, 1);
			i--;
		}
	}

	Utils.setPathFromObject(baseConfiguration, 'forms.address.showAddressLine2', Utils.getPathFromObject(baseConfiguration, 'forms.address.showAddressLineTwo', true));

	return baseConfiguration;

});
