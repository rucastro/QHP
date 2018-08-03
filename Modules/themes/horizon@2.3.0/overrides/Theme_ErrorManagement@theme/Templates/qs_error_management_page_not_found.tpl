{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="error-management-page-not-found">
    <div class="error-management-page-not-found-header" style="{{#if backgroundImage}}background-image: url({{backgroundImage}});{{/if}}{{#if backgroundColor}}background-color: {{backgroundColor}};{{/if}}">
		<div class="error-management-page-not-found-caption">
			<div class="error-management-page-not-found-title">
				{{#if title}}
					<h1>{{{title}}}</h1>
				{{else}}
					<h1>{{pageHeader}}</h1>
				{{/if}}
				{{#if text}}
					<p class="error-management-page-not-found-text">{{text}}</p>
				{{/if}}
			</div>
			{{#if btnText}}
			<div class="error-management-page-not-found-button-container">
				<a href="{{btnHref}}" class="error-management-page-not-found-button">
					{{btnText}}
				</a>
			</div>
			{{/if}}
		</div>
    </div>

	<div id="error-management-page-not-found-content" class="error-management-page-not-found-content"></div>

	<!-- <div id="error-management-page-not-found-cms" class="error-management-page-not-found-cms" data-cms-area="page_not_found_cms" data-cms-area-filters="page_type"></div> -->
</div>
