
<div class="assembly-item-cell-list {{classCell}} " data-type="item" data-item-id="{{itemId}}" itemprop="itemListElement" itemscope="" itemtype="http://schema.org/Product" data-track-productlist-list="{{track_productlist_list}}" data-track-productlist-category="{{track_productlist_category}}" data-track-productlist-position="{{track_productlist_position}}" data-sku="{{sku}}">
    <meta itemprop="url" content="{{url}}"/>

   <!-- <div class="facets-item-cell-grid-image-wrapper">
        {{#if isEnvironmentBrowser}}
        <div class="facets-item-cell-grid-quick-view-wrapper">
            <a href="{{url}}" class="facets-item-cell-grid-quick-view-link" data-toggle="show-in-modal">
                <i class="facets-item-cell-grid-quick-view-icon"></i>
                {{translate 'Quick View'}}
            </a>
        </div>
        {{/if}}
    </div>-->
    {{#if showAssemblyHeading}}
    <div class="assembly-parent-separator">
        {{#if isAssemblyParent}}
        <h6 class="assembly-parent-separator-text">{{assemblyTitleHeading}}</h6>
        {{/if}}
        {{#if assemblyTitleHeading}}
        <div class="assembly-table-separator">
            <div class="assembly-separator-item">
                <span>{{translate 'Item'}}</span>
            </div>
            <div class="assembly-separator-part">
                <span>{{translate 'Part#'}}</span>
            </div>
            <div class="assembly-separator-description">
                <span>{{translate 'Description'}}</span>
            </div>
            <div class="assembly-separator-price">
                <span>{{translate 'Price'}}</span>
            </div>
            <div class="assembly-separator-quantity">
                <span>{{translate 'Qty'}}</span>
            </div>
            <div class="assembly-separator-addtocart">
                <span></span>
            </div>
        </div>
        {{/if}}

    </div>
    {{/if}}
    <div class="assembly-item-cell-list-details">
        <div class="assembly-col-item">
                {{imageIndex}}
        </div>
        <div class="assembly-col-partnum">
            {{sku}}
        </div>
        <div class="assembly-col-description">
            <a href="{{url}}" class="assembly-item-cell-quick-view-link" {{#if noRedirect}} data-toggle="show-in-modal"{{/if}}>
                <span itemprop="name">{{name}}</span>
            </a>
        </div>
      <!--  <div class="assembly-col-price" data-view="ItemViews.Price">

        </div>-->
        <div class="assembly-col-quickadd" data-view="Cart.QuickAddToCart"></div>

    </div>
</div>


