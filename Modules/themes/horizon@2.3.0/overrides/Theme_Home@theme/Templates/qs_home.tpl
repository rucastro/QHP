{{!
    © 2017 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
}}

<div class="home">
    <!-- HERO PROMO -->
    {{#each hero}}
    <div class="home-hero">
        <div class="hero-wrapper" style="background-image: url({{../url}}{{image}});"></div>
        <div class="home-info-container">
            <a{{objectToAtrributes item}}>
                <div class="home-info">
                    {{#if title}}<h2 class="home-info-title">{{title}}</h2>{{/if}}
                    {{#if text}}<h3 class="home-info-text">{{text}}</h3>{{/if}}
                    <span class="home-info-linktext">{{#if linktext}}{{linktext}}{{else}}{{translate 'Shop Now'}}{{/if}}</span>
                </div>
            </a>
        </div>
    </div>
    {{/each}}

    <!-- ANNOUNCEMENT -->
    {{#if announcement}}
    <div class="home-announcement">{{translate announcement}}</div>
    {{/if}}

    <!-- CMS MERCHANDISING ZONE -->
    <div class="home-merchandizing-zone">
        <div class="home-merchandizing-zone-content">
            <div data-cms-area="home_merchandizing_zone" data-cms-area-filters="path"></div>
        </div>
    </div>

    <!--
    INFOBLOCKS
    The first two infloblocks are styled to span 50% of the viewport on larger devices
    Any subsequent infoblocks span full width
    -->
    <div class="home-infoblock-layout">
        {{#each infoblock}}
        <a{{objectToAtrributes item}} class="home-infoblock-link">
            <div class="home-infoblock {{#unless singleInfoblock}}home-infoblock{{@index}}{{/unless}}"
            style="background-image: url({{../url}}{{image}}); background-color:{{#if color}}{{color}}{{else}}darkgray{{/if}};">
                <div class="home-infoblock-content">
                    <div class="home-infoblock-info">
                        {{#if title}}<h2 class="home-info-title">{{title}}</h2>{{/if}}
                        {{#if text}}<h3 class="home-info-text">{{text}}</h3>{{/if}}
                        <span class="home-info-linktext">{{#if linktext}}{{linktext}}{{else}}{{translate 'Shop Now'}}{{/if}}</span>
                    </div>
                </div>
            </div>
        </a>
        {{/each}}
    </div>

    <!-- CMS ZONE -->
    <div class="home-cms-zone" data-cms-area="home_content_middle" data-cms-area-filters="path"></div>

    <!-- CAROUSEL -->
    {{#if showCarousel}}
    <div class="home-slider-container">
        <div class="home-image-slider">
            <ul data-slider class="home-image-slider-list">
                {{#each carousel}}
                <li>
                    <div class="home-slide-main-container">
                        <img src="{{image}}" class="home-slide-image">
                        <div class="home-info-container">
                            <a{{objectToAtrributes item}}>
                                <div class="home-info">
                                    {{#if title}}<h2 class="home-info-title">{{title}}</h2>{{/if}}
                                    {{#if text}}<h3 class="home-info-text">{{text}}</h3>{{/if}}
                                    <span class="home-info-linktext">{{#if linktext}}{{linktext}}{{else}}{{translate 'Shop Now'}}{{/if}}</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </li>
                {{/each}}
            </ul>
        </div>
    </div>
    {{/if}}

    <!-- CMS ZONE -->
    <div class="home-cms-zone" data-cms-area="home_content_bottom" data-cms-area-filters="path"></div>

</div>
