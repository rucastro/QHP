{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<tr id="{{lineId}}" data-item-id="{{itemId}}" data-type="order-item" {{#if showGeneralClass}} class="{{generalClass}}" {{/if}} >
	<td class="transaction-line-views-cell-actionable-table-first">
		<div class="transaction-line-views-cell-actionable-thumbnail">
			{{#if isNavigable}}
				<a {{{linkAttributes}}}>
					<img src="{{resizeImage thumbnail.url 'thumbnail'}}" alt="{{thumbnail.altimagetext}}">
				</a>
			{{else}}
				<img src="{{resizeImage thumbnail.url 'thumbnail'}}" alt="{{thumbnail.altimagetext}}">
			{{/if}}
		</div>
	</td>
	<td class="transaction-line-views-cell-actionable-table-middle">
		<div class="transaction-line-views-cell-actionable-name">
		{{#if isNavigable}}
			<a {{{linkAttributes}}} class="transaction-line-views-cell-actionable-name-link">
				{{item._name}}
			</a>
		{{else}}
				<span class="transaction-line-views-cell-actionable-name-viewonly">{{item._name}}</span>
		{{/if}}
		</div>
		<div class="transaction-line-views-cell-actionable-price">
			<div data-view="Item.Price"></div>
		</div>
		<div data-view="Item.Sku"></div>
		<div class="transaction-line-views-cell-actionable-options">
			<div data-view="Item.SelectedOptions"></div>
		</div>

		<div class="transaction-line-views-cell-actionable-stock" data-view="ItemViews.Stock.View">
		</div>

	</td>
	{{#if showSummaryView}}
	<td class="transaction-line-views-cell-actionable-table-summary">
		<div class="transaction-line-views-cell-actionable-summary" data-view="Item.Summary.View"></div>
	</td>
	{{/if}}
	<td class="transaction-line-views-cell-actionable-table-last">
		<div data-view="Item.Actions.View"></div>

		{{#if showAlert}}
			<div class="transaction-line-views-cell-actionable-alert-placeholder" data-type="alert-placeholder"></div>
		{{/if}}

		{{#if showCustomAlert}}
			<div class="alert alert-{{customAlertType}}">
				{{item._cartCustomAlert}}
			</div>
		{{/if}}
	</td>
</tr>
<tr class="cart-divider-row"><td colspan="4"><div class="cart-divider"></div></td></tr>