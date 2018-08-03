
<section class="facets-facet-browse">
    <div data-cms-area="item_list_banner" data-cms-area-filters="page_type"></div>

    <div class="assembly-title">
        <h1>{{category_name}}</h1>
    </div>
    {{#if showResults}}
    <div class="facets-facet-browse-content">
        <div class="facets-assembly-image-container">
            <div class="facets-assembly-image-placeholder">
                <div class="facets-assembly-float-left">
                    <div class="facets-assembly-pl-container">
                        <img src="{{category_image}}">
                    </div>
                </div>

            </div>
        </div>
        <div class="facets-assembly-results" itemscope="" itemtype="https://schema.org/ItemList">

            <meta itemprop="name" content="{{title}}"/>
            <div id="banner-section-top" class="content-banner banner-section-top" data-cms-area="item_list_banner_top" data-cms-area-filters="path"></div>


            {{#if showItems}}
            <div class="facets-facet-browse-narrowedby" data-view="Facets.FacetsDisplay">
            </div>

            {{#if isEmptyList}}
            <div data-view="Facets.Items.Empty">
            </div>
            {{else}}
            {{#if showMainHeader}}
            <div class="assembly-list-header">
                <div class="assembly-col-item">
                    {{translate 'Item'}}
                </div>
                <div class="assembly-col-partnum">
                    {{translate 'Part #'}}
                </div>
                <div class="assembly-col-description">
                    {{translate 'Description'}}
                </div>

                <div class="assembly-col-price">
                    {{translate 'Price'}}
                </div>
                <div class="assembly-col-quantity">
                    {{translate 'Qty'}}
                </div>
                <div class="assembly-col-addtocart">
                    &nbsp;
                </div>
            </div>
            {{/if}}
            <div class="facets-facet-browse-items" data-view="Facets.Items">
            </div>
            {{/if}}
            {{/if}}
        </div>
    </div>
    {{else}}
    <div class="facets-facet-browse-empty-items" data-view="Facets.Items.Empty">
    </div>
    {{/if}}

    <div id="banner-section-bottom" class="content-banner banner-section-bottom" data-cms-area="item_list_banner_bottom" data-cms-area-filters="page_type"></div>
</section>
