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

    <div class="footer-content footer-simplified">
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



{{!----
The context variables for this template are not currently documented. Use the {{log this}} helper to view the context variables in the Console of your browser's developer tools.

----}}
