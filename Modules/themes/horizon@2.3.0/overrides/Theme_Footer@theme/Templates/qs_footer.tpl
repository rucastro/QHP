{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<section class="footer-wrapper"{{#if backgroundUrl}} style="background-image: url({{backgroundUrl}});"{{/if}}>

    <div data-view="Global.BackToTop"></div>
    <div id="banner-footer" class="content-banner banner-footer" data-cms-area="global_banner_footer"
         data-cms-area-filters="global"></div>

    <div class="footer-content">
        <div class="footer-content-nav">

            {{#if col1Links}}
            <ul class="footer-content-nav-list">
            {{#each col1Links}}
            {{#if href}}
                <li class="footer-column-link-listitem"><a class="footer-column-link" {{objectToAtrributes item}} data-hashtag="{{datahashtag}}" data-touchpoint="{{datatouchpoint}}" data-target="{{datatarget}}">{{text}}</a></li>
            {{else}}
                <li class="footer-column-heading-listitem"><h4 class="footer-column-heading">{{text}}</h4></li>
            {{/if}}
            {{/each}}
            </ul>
            {{/if}}

            {{#if col2Links}}
            <ul class="footer-content-nav-list">
            {{#each col2Links}}
            {{#if href}}
                <li class="footer-column-link-listitem"><a class="footer-column-link" {{objectToAtrributes item}} data-hashtag="{{datahashtag}}" data-touchpoint="{{datatouchpoint}}" data-target="{{datatarget}}">{{text}}</a></li>
            {{else}}
                <li class="footer-column-heading-listitem"><h4 class="footer-column-heading">{{text}}</h4></li>
            {{/if}}
            {{/each}}
            </ul>
            {{/if}}

            {{#if col3Links}}
            <ul class="footer-content-nav-list">
            {{#each col3Links}}
            {{#if href}}
                <li class="footer-column-link-listitem"><a class="footer-column-link" {{objectToAtrributes item}} data-hashtag="{{datahashtag}}" data-touchpoint="{{datatouchpoint}}" data-target="{{datatarget}}">{{text}}</a></li>
            {{else}}
                <li class="footer-column-heading-listitem"><h4 class="footer-column-heading">{{text}}</h4></li>
            {{/if}}
            {{/each}}
            </ul>
            {{/if}}

            {{#if col4Links}}
            <ul class="footer-content-nav-list">
            {{#each col4Links}}
            {{#if href}}
                <li class="footer-column-link-listitem"><a class="footer-column-link" {{objectToAtrributes item}} data-hashtag="{{datahashtag}}" data-touchpoint="{{datatouchpoint}}" data-target="{{datatarget}}">{{text}}</a></li>
            {{else}}
                <li class="footer-column-heading-listitem"><h4 class="footer-column-heading">{{text}}</h4></li>
            {{/if}}
            {{/each}}
            </ul>
            {{/if}}
        </div>

        <div class="footer-content-newsletter">
            <div data-view="FooterContent"></div>
        </div>

        <div class="footer-content-bottom">
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
            <div class="footer-extra-info" data-view="LowerText"></div>
        </div>
    </div>

</section>
