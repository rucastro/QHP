{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<!-- CAROUSEL -->
{{#if showCarousel}}
<div class="home-fluid">
    <div class="home-slider-container">
        <div class="home-image-slider">
            <ul data-slider class="home-image-slider-list">
                {{#each carousel}}
                    <li>
                        <div class="home-slide-main-container" style="background-image: url({{image}});">
                            <img src="{{image}}" class="home-slide-image" style="display: none;">
                            <div class="home-slide-caption" style="background-image: url({{../carouselBgrImg}});">
                                <div class="home-slide-caption-content">
                                    {{#if title}}<h2 class="home-slide-caption-title">{{title}}</h2>{{/if}}
                                    {{#if text}}<p>{{text}}</p>{{/if}}
                                    <div class="home-slide-caption-button-container">
                                        <a{{objectToAtrributes item}} class="home-slide-caption-button">{{#if text}}{{linktext}}{{else}}{{translate 'Shop now'}}{{/if}} <i class="home-slide-button-icon"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                {{/each}}
            </ul>
        </div>
    </div>
</div>
{{/if}}

<div class="home">

    <!-- TOP PROMO -->
    {{#if topPromo}}
        {{#each topPromo}}
		<div class="home-top-promo-container">
			<div class="home-top-promo" {{#if color}}style="background: {{#if color}}{{color}}{{else}}gray{{/if}};{{/if}}">
				{{#if text}}
				<div class="home-top-promo-text">{{{text}}}</div>
				{{/if}}
				{{#if image}}
				<div class="home-top-promo-image">
					<a href="{{href}}"><img src="{{../../url}}{{image}}" /></a>
				</div>
				{{/if}}
			</div>
		</div>
        {{/each}}
    {{/if}}

    <div class="home-cms-zone" data-cms-area="home_content_top" data-cms-area-filters="path"></div>

	<!-- CMS MERCHANDISING ZONE -->
	<div class="home-merchandizing-zone">
		<div class="home-merchandizing-zone-content">
			<div data-cms-area="home_merchandizing_zone" data-cms-area-filters="path"></div>
		</div>
	</div>

	<!--
    INFOBLOCKS
    The markup is quite different when there are 5 infoblocks, hence the extra conditions
    It is however built this way so the customer can upload any number of infoblocks and it still looks good
    -->
    {{#if infoblockFive}}
    <div class="home-infoblock-layout5">
        {{#each infoblock}}
        {{#if @first}}
            <div class="home-infoblock-quadblock-wrapper">
                <div class="home-infoblock-quadblock">
        {{/if}}
                    <div class="home-infoblock home-infoblock{{@index}}" style="background-image: url({{../url}}{{image}});{{#if color}}background-color:{{color}}{{else}}lightgray{{/if}};">
                        <div class="home-infoblock-content">
                            {{#if title}}
                            <h2 class="home-infoblock-title"><a{{objectToAtrributes item}} class="home-infoblock-title-link">{{title}}</a></h2>
                            {{/if}}
                            {{#if text}}<h3 class="home-infoblock-text"><a{{objectToAtrributes item}} class="home-infoblock-text-link">{{text}}</a></h3>{{/if}}
                        </div>
                        <div class="home-infoblock-highlight"></div>
                    </div>
        {{#if @last}}
                </div>
            </div>
            <div class="home-infoblock-last" style="background-image: url({{../../url}}{{image}});{{#if color}}background-color:{{color}}{{else}}gray{{/if}};">
                <div class="home-infoblock-content">
                    {{#if title}}<h2 class="home-infoblock-title"><a{{objectToAtrributes item}} class="home-infoblock-title-link">{{title}}</a></h2>{{/if}}
                    {{#if text}}<h3 class="home-infoblock-text"><a{{objectToAtrributes item}} class="home-infoblock-text-link">{{text}}</a></h3>{{/if}}
                </div>
                <div class="home-infoblock-highlight"></div>
                </div>
        {{/if}}
        {{/each}}
    </div>
    {{else}}
    <div class="{{#if infoblockTile}}home-infoblock-layout3{{else}}home-infoblock-layout{{infoblockCount}}{{/if}}">
        {{#each infoblock}}
        <div class="home-infoblock"
        style="background-image: url({{../url}}{{image}});{{#if color}}background-color:{{color}}{{else}}darkgray{{/if}};">
            <div class="home-infoblock-content">
                {{#if title}}<h2 class="home-infoblock-title"><a{{objectToAtrributes item}} class="home-infoblock-title-link">{{title}}</a></h2>{{/if}}
                {{#if text}}<h3 class="home-infoblock-text"><a{{objectToAtrributes item}} class="home-infoblock-text-link">{{text}}</a></h3>{{/if}}
            </div>
            <div class="home-infoblock-highlight"></div>
        </div>
        {{/each}}
    </div>
    {{/if}}


    <div class="home-cms-zone" data-cms-area="home_content_middle" data-cms-area-filters="path"></div>

	<!-- FREE TEXT AND IMAGES -->
    {{#if freeTextTitle}}
    <div class="home-page-freetext-content-header">
        <div class="home-cms-page-bottom-content-title">
            <h3>{{freeTextTitle}}</h3>
        </div>
    </div>
    {{/if}}
    <div class="home-page-freetext-content">
        <div class="home-page-freetext-content-text">
            <div data-view="FreeText"></div>
        </div>
        {{#if showFreeTextImages}}
        <div class="home-page-freetext-content-images-wrapper">
            <div class="home-page-freetext-content-images">
                {{#each freeTextImages}}
                <div class="home-page-freetext-content-image"><a{{objectToAtrributes item}}><img src="{{../url}}{{image}}"></a></div>
                {{/each}}
            </div>
        </div>
        {{/if}}
    </div>

    <div class="home-cms-zone" data-cms-area="home_content_bottom" data-cms-area-filters="path"></div>

</div>
