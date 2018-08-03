{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if banner}}<div class="facets-browse-category-heading-main-image" style="background-image: url('{{resizeImage banner 'categorybanner'}}');"></div>{{/if}}
{{#if description}}
<section class="facets-browse-category-heading-list-header">
	<div class="facets-browse-category-heading-main-description">
		<h1>{{pageheading}}</h1>
		<p>{{{description}}}</p>
	</div>
</section>
{{/if}}