{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}
<div class="contact-us-landing-page-container">
    <header class="contact-us-landing-page-header">
        <h1 class="contact-us-landing-page-title">{{pageHeader}}</h1>

        <div id="contact-us-landing-page-header-cms" class="contact-us-landing-page-header-cms" data-cms-area="contact-us-landing-page-header-cms" data-cms-area-filters="path"></div>
    </header>

    <div class="contact-us-landing-page-content">

        <div id="contact-us-landing-page-cms" class="contact-us-landing-page-cms" data-cms-area="contact-us-landing-page-cms" data-cms-area-filters="path"></div>
        <div class="contact-us-landing-page-alert-placeholder" data-type="alert-placeholder"></div>

		{{#if contactInfoBlocks}}
		<div class="contact-us-landing-page-contact-info-blocks-container">
			{{#each contactInfoBlocks}}
				<div class="contact-us-landing-page-contact-info-block">
					<div class="contact-us-landing-page-contact-info-block-content">
						{{#if image}}
							<img src="{{../../url}}{{image}}" class="contact-us-landing-page-contact-info-block-image" />
						{{/if}}
						{{#if title}}
							<div class="contact-us-landing-page-contact-info-block-title">{{{title}}}</div>
						{{/if}}
						{{#if text}}
							<div class="contact-us-landing-page-contact-info-block-text">{{{text}}}</div>
						{{/if}}
					</div>
				</div>
			{{/each}}
		</div>
		{{/if}}

		{{#if additonalContactInfoBlocks}}
		<div class="contact-us-landing-page-additional-contact-info-blocks-container">
			{{#each additonalContactInfoBlocks}}
				<div class="contact-us-landing-page-additional-contact-info-block">
					<div class="contact-us-landing-page-additional-contact-info-block-content">
						{{#if title}}
							<div class="contact-us-landing-page-additional-contact-info-block-title">{{{title}}}</div>
						{{/if}}
						{{#if text}}
							<div class="contact-us-landing-page-additional-contact-info-block-text">{{{text}}}</div>
						{{/if}}
					</div>
				</div>
			{{/each}}
		</div>
		{{/if}}

    </div>

</div>
