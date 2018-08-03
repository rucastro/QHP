<div class="look-item" data-type="item" data-item-id="{{itemId}}" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/Product">
    <meta itemprop="url" content="{{url}}"/>

    <div class="look-item-image-wrapper">
        <a class="look-item-link-image" href="{{url}}">
            {{#if imageId}}
            <img class="look-item-image" src="{{resizeImage image.name 'image'}}" alt="{{name}}" itemprop="image"/>
            {{else}}
            <img class="look-item-image" src="{{resizeImage thumbnail.url 'thumbnail'}}" alt="{{thumbnail.altimagetext}}" itemprop="image"/>
            {{/if}}
        </a>
        {{#if isEnvironmentBrowser}}
        <div class="look-item-quick-view-wrapper">
            <a href="{{url}}" class="look-item-quick-view-link" data-toggle="show-in-modal">
                <i class="look-item-quick-view-icon"></i>
                {{#if link}}
                {{link}}
                {{else}}
                {{translate 'Quick View'}}
                {{/if}}
            </a>
        </div>
        {{/if}}
    </div>

    <div class="look-item-details">
        <a class="look-item-title" href="{{url}}">
            <span itemprop="name">{{name}}</span>
        </a>

        <div class="look-item-price" data-view="ItemViews.Price">
        </div>

        {{#if description}}<div class="look-item-description">{{description}}</div>{{/if}}

        <div data-view="ItemDetails.Options"></div>
        <div class="look-item-stock">
            <div data-view="ItemViews.Stock"></div>
        </div>

    </div>
</div>
