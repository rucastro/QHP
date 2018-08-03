{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div itemprop="itemListElement" data-item-id="{{itemId}}" data-track-productlist-list="{{track_productlist_list}}" data-track-productlist-category="{{track_productlist_category}}" data-track-productlist-position="{{track_productlist_position}}" data-sku="{{sku}}">
	<a class="item-relations-related-item-thumbnail" {{{itemURL}}}><img src="{{resizeImage thumbnail.url 'homeslider'}}" alt="{{thumbnail.altimagetext}}" /></a>
	<div class="item-relations-related-item-text">
		<a {{{itemURL}}}>

				<span class="item-relations-related-item-title" itemprop="name">{{itemName}}</span>
				<div class="item-relations-related-item-price" data-view="Item.Price"></div>

				{{#if showRating}}
				<div class="item-relations-related-item-rate" data-view="Global.StarRating"></div>
				{{/if}}

		</a>
	</div>
</div>