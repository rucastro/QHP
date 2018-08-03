<div class="lookbook-layout-container">
    <div class="lookbook-slider-container">
    {{#if displayLookBookSlide}}
    {{else}}
    <div class="lookbook-header">
        <h1 class="lookbook-slide-caption-title">{{name}}</h1>
        {{#if shortdesc}}<p class="lookbook-slide-shortdesc">{{shortdesc}}</p>{{/if}}
        {{#if longdesc}}<p class="lookbook-slide-longdesc">{{longdesc}}</p>{{/if}}
    </div>
    {{/if}}
    <div class="lookbook-cms-intro" data-cms-area="lookbook_intro" data-cms-area-filters="path"></div>
        <div class="lookbook-image-slider">
            <ul data-slider class="lookbook-image-slider-list">
                {{!-- if configured, the first slide is the lookbook main image and text --}}
                {{#if displayLookBookSlide}}
                <li>
                    <div class="lookbook-slide-main-container">
                        <div class="lookbook-slide-caption lookbook-slide-caption-align-{{align}}">
                            <h1 class="lookbook-slide-caption-title"{{#if textcolor}} style="color:{{textcolor}}"{{/if}}>{{name}}</h1>
                            {{#if shortdesc}}<p class="lookbook-slide-shortdesc"{{#if textcolor}} style="color:{{textcolor}}"{{/if}}>{{shortdesc}}</p>{{/if}}
                            {{#if longdesc}}<p class="lookbook-slide-longdesc"{{#if textcolor}} style="color:{{textcolor}}"{{/if}}>{{longdesc}}</p>{{/if}}
                        </div>
                        <img src="{{image.name}}" alt="{{name}}" />
                    </div>
                </li>
                {{/if}}
                {{!-- start slides from looks --}}
                {{#each looks}}
                <li>
                    <div class="lookbook-slide-main-container">
                        <div class="lookbook-slide-caption lookbook-slide-caption-align-{{align}}">
                            <h2 class="lookbook-slide-caption-title"{{#if textcolor}} style="color:{{textcolor}}"{{/if}}>{{name}}</h2>
                            {{#if shortdesc}}<p class="lookbook-slide-shortdesc"{{#if textcolor}} style="color:{{textcolor}}"{{/if}}>{{shortdesc}}</p>{{/if}}
                            {{#if longdesc}}<p class="lookbook-slide-longdesc"{{#if textcolor}} style="color:{{textcolor}}"{{/if}}>{{longdesc}}</p>{{/if}}
                            <a href="lookbook/{{../urlcomponent}}/{{urlcomponent}}" class="lookbook-look-button">{{#if linktext}}{{linktext}}{{else}}{{ translate 'Shop The Look' }}{{/if}}</a>
                        </div>
                        <a href="lookbook/{{../urlcomponent}}/{{urlcomponent}}"><img src="{{image1.name}}" alt="{{name}}" /></a>
                    </div>
                </li>
                {{/each}}
                {{!-- end slides from looks --}}
            </ul>
        </div>
        <div class="lookbook-cms-footer" data-cms-area="lookbook_footer" data-cms-area-filters="path"></div>
    </div>

</div>
