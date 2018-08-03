{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="cart-detailed">
	<div class="cart-detailed-view-header">
		<header class="cart-detailed-header">
			{{#if showLines}}
			<h1 class="cart-detailed-title">
				{{pageHeader}}
				<small class="cart-detailed-title-details-count">
					{{productsAndItemsCount}}
				</small>
			</h1>
			{{else}}
				<h2 class="cart-detailed-title">{{translate 'Your Shopping Cart is empty'}}</h2>
			{{/if}}
		</header>
	</div>

	<div class="cart-detailed-body">
		<section class="{{#if showLines}}cart-detailed-left {{else}}cart-detailed-empty{{/if}}">
			{{#unless showLines}}
				<div data-view="Quick.Order.EmptyCart">
					<p class="cart-detailed-body-info">
						{{translate 'Continue Shopping on our <a href="/" data-touchpoint="home">Home Page</a>.' }}
					</p>
				</div>
			{{/unless}}

			<div data-view="Quick.Order"></div>

			{{#if showLines}}
			<div class="cart-detailed-proceed-to-checkout-container">
				<a class="cart-detailed-proceed-to-checkout" data-action="sticky" href="#" data-touchpoint="checkout" data-hashtag="#">
					{{translate 'Proceed to Checkout'}}
				</a>
			</div>
			<div data-confirm-message class="cart-detailed-confirm-message"></div>

			<table class="cart-detailed-item-view-cell-actionable-table cart-detailed-table-row-with-border">
				<tbody data-view="Item.ListNavigable">
				</tbody>
			</table>
			{{/if}}
		</section>

		{{#if showLines}}
		<section class="cart-detailed-right">
			<div data-view="Cart.Summary"></div>
		</section>
		{{/if}}
	</div>
	<div class="cart-detailed-footer">
			<div data-view="SavedForLater" class="cart-detailed-savedforlater"></div>
	</div>
</div>
<div class="cart-outside-footer">
{{#if showLines}}
	<div data-view="RecentlyViewed.Items" class="cart-detailed-recently-viewed"></div>
	<div data-view="Related.Items" class="cart-detailed-related"></div>
	<div data-view="Correlated.Items" class="cart-detailed-correlated"></div>
{{/if}}
</div>
