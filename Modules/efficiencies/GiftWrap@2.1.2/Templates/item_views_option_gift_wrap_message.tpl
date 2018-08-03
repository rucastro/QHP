{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if shouldEnableGiftMessage}}
<div class="item-views-option-gift-wrap-message" id="{{cartOptionId}}-container" data-type="option" data-cart-option-id="{{cartOptionId}}" data-item-option-id="{{itemOptionId}}">
        <label class="item-views-option-gift-wrap-message-label" for="{{cartOptionId}}">
            {{label}}:
        </label>
        <textarea
                name="{{cartOptionId}}"
                id="{{cartOptionId}}"
                class="product-views-option-text-area"
                data-toggle="text-option"
                data-available="true"
                data-id="{{itemOptionId}}">{{#if showSelectedOption}}{{selectedOption.internalId}}{{/if}}</textarea>
</div>
{{/if}}
