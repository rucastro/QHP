{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div id="{{cartOptionId}}-container" class="product-views-option-dropdown item-views-option-color" data-type="option" data-cart-option-id="{{cartOptionId}}" data-item-option-id="{{itemOptionId}}">
	<div class="{{cartOptionId}}-controls-group" data-validation="control-group">
		{{#if showLabel}}
			<label class="product-views-option-dropdown-label item-views-option-color-label" for="{{cartOptionId}}">
				{{label}}
				{{#if showSelectedValue}}
					: <span data-value="{{cartOptionId}}">{{selectedValue.label}}</span>
				{{/if}}
				{{#if showRequiredLabel}}<span class="product-views-option-dropdown-label-required">*</span>{{/if}}
			</label>
		{{/if}}
		<div class="{{cartOptionId}}-controls" data-validation="control">
			<select name="{{cartOptionId}}" id="{{cartOptionId}}" class="product-views-option-dropdown-select input-medium" data-toggle="select-option">
				<option value="">{{translate '- Select -'}}</option>
				{{#each values}}
					{{#if internalId}}
						<option
							value="{{internalId}}"
							{{#if isActive}}selected{{/if}}
							data-active="{{isActive}}"
							data-available="{{isAvailable}}">
								{{label}}
						</option>
					{{/if}}
				{{/each}}
			</select>
		</div>
	</div>
</div>