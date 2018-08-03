<div class="look-layout-container">
    <h1 class="look-title">{{name}}</h1>
    <div class="look-divider-desktop"></div>
    <h2 class="look-subtitle">{{translate 'Shop The Look'}}</h2>
    <div class="look-cms-intro" data-cms-area="look_intro" data-cms-area-filters="path"></div>
    <div class="look-container">
        <div class="look-main-image">
            {{#if altimage.name}}
            <ul data-slider class="look-image-slider-list">
                <li><img class="look-image" src="{{resizeImage mainimage.name}}" alt="{{name}}" itemprop="image" /></li>
                <li><img class="look-image" src="{{resizeImage altimage.name}}" alt="{{name}}" itemprop="image" /></li>
            </ul>
            {{else}}
            <img class="look-image" src="{{resizeImage mainimage.name}}" alt="{{name}}" itemprop="image" />
            {{/if}}
        </div>
        <div class="look-items-container">
            {{!-- start Look Items --}}
            <div data-view="LookBook.LookItems"></div>
            {{!-- end Look Items --}}
        </div>
    </div>
    {{#if longdesc}}
    <div class="look-details">
        <h2 class="look-details-title">{{translate 'Details'}}</h2>
        <p class="look-details-shortdesc">{{shortdesc}}</p>
        <p class="look-details-longdesc">{{longdesc}}</p>
        <div class="look-cms-details" data-cms-area="look_details" data-cms-area-filters="path"></div>
    </div>
    {{/if}}
</div>