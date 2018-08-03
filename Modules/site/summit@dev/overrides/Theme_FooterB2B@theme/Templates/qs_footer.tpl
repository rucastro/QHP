{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div data-view="Global.BackToTop"></div>
<div class="footer-content">
    <div class="footer-banner">
		<div id="banner-footer-top" class="content-banner-top banner-footer-top" data-cms-area="global_banner_footer_top" data-cms-area-filters="path"></div>
		<div id="banner-footer" class="content-banner banner-footer" data-cms-area="global_banner_footer" data-cms-area-filters="global"></div>
    </div>

    <div class="footer-content-nav-copyright">
    	<div class="footer-content-nav">
    		{{#if showFooterNavigationLinks}}
    			<ul class="footer-content-nav-list">
    				{{#each footerNavigationLinks}}
    					<li>
    						<a {{objectToAtrributes item}}>
    							{{text}}
    						</a>
    					</li>
    				{{/each}}
    			</ul>
    		{{/if}}
    	</div>

    	<div class="footer-content-copyright">
			{{#with copyright}}
                {{#unless hide}}
                    {{#if showRange}}
                        {{translate '&copy; $(0) &#8211; $(1) $(2)' initialYear currentYear companyName}}
                        <!-- an en dash &#8211; is used to indicate a range of values -->
                    {{else}}
                        {{translate '&copy; $(0) $(1)' currentYear companyName}}
                    {{/if}}
                {{/unless}}
            {{/with}}
    	</div>
    </div>

    <div class="footer-content-newsletter-social">
        <div class="footer-content-newsletter" data-view="FooterContent"></div>
		{{#if socialMediaLinks}}
        <div class="footer-content-social">
            <ul class="footer-content-social-list">
            {{#if socialMediaLinksTitle}}<li>{{socialMediaLinksTitle}}</li>{{/if}}
            {{#each socialMediaLinks}}
                <li><a {{objectToAtrributes item}} data-hashtag="{{datahashtag}}" data-touchpoint="{{datatouchpoint}}" data-target="{{datatarget}}">{{#if icon}}<i class="footer-content-social-icon icon-{{icon}}"></i>{{else}}{{text}}{{/if}}</a></li>
            {{/each}}
            </ul>
        </div>
        {{/if}}
    </div>

</div>

<div class="footer-columns-wrapper">
    <div class="footer-columns-container">
        <div class="footer-columns">
            {{#if col1Links}}
            <div class="footer-column-links">
                <ul>
                {{#each col1Links}}
                {{#if href}}
                    <li class="footer-column-link-listitem"><a class="footer-column-link" {{objectToAtrributes item}} data-hashtag="{{datahashtag}}" data-touchpoint="{{datatouchpoint}}" data-target="{{datatarget}}">{{text}}</a></li>
                {{else}}
                    <li class="footer-column-heading-listitem"><h4 class="footer-column-heading">{{text}}</h4></li>
                {{/if}}
                {{/each}}
                </ul>
            </div>
            {{/if}}
            {{#if col2Links}}
            <div class="footer-column-links">
                <ul>
                {{#each col2Links}}
                {{#if href}}
                    <li class="footer-column-link-listitem"><a class="footer-column-link" {{objectToAtrributes item}} data-hashtag="{{datahashtag}}" data-touchpoint="{{datatouchpoint}}" data-target="{{datatarget}}">{{text}}</a></li>
                {{else}}
                    <li class="footer-column-heading-listitem"><h4 class="footer-column-heading">{{text}}</h4></li>
                {{/if}}
                {{/each}}
                </ul>
            </div>
            {{/if}}
            {{#if col3Links}}
            <div class="footer-column-links">
                <ul>
                {{#each col3Links}}
                {{#if href}}
                    <li class="footer-column-link-listitem"><a class="footer-column-link" {{objectToAtrributes item}} data-hashtag="{{datahashtag}}" data-touchpoint="{{datatouchpoint}}" data-target="{{datatarget}}">{{text}}</a></li>
                {{else}}
                    <li class="footer-column-heading-listitem"><h4 class="footer-column-heading">{{text}}</h4></li>
                {{/if}}
                {{/each}}
                </ul>
            </div>
            {{/if}}
            {{#if col4Links}}
            <div class="footer-column-links">
                <ul>
                {{#each col4Links}}
                {{#if href}}
                    <li class="footer-column-link-listitem"><a class="footer-column-link" {{objectToAtrributes item}} data-hashtag="{{datahashtag}}" data-touchpoint="{{datatouchpoint}}" data-target="{{datatarget}}">{{text}}</a></li>
                {{else}}
                    <li class="footer-column-heading-listitem"><h4 class="footer-column-heading">{{text}}</h4></li>
                {{/if}}
                {{/each}}
                </ul>
            </div>
            {{/if}}

        </div>
    </div>
</div>