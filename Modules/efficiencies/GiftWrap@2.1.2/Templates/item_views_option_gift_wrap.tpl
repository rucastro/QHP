{{#if isGiftWrappable}}
   <div
        class="item-views-option-dropdown-gift-wrap"
        data-id="{{itemOptionId}}"
        data-type="option"
        data-cart-option-id="{{cartOptionId}}">

    <h4>{{translate 'Buying a gift'}}?</h4>

    <div class="item-views-option-dropdown-gift-wrap-label-wrapper">
        <label class="item-views-option-gift-wrap-message-label">Add {{label}}:</label>
    </div>

    {{#if isCheckboxMode}}
        {{#if firstOption.isAvailable}}
        <div class="item-views-option-dropdown-gift-wrap-label-wrapper">
            <label
                class="item-views-option-dropdown-gift-wrap-checkbox
                {{#if isActive}}active{{/if}}
                {{#unless isAvailable}}muted{{/unless}}">

                <input
                    type="checkbox"
                    name="{{cartOptionId}}"
                    value="{{firstOption.internalid}}"
                    {{#if isActive}}checked{{/if}}
                    data-toggle="set-option"
                    data-active="{{isActive}}"
                    data-available="{{isAvailable}}"/>
                <span>{{firstOption.label}}</span>
            </label>
        </div>
        <div class="item-views-option-dropdown-gift-wrap-label-wrapper">
            {{#if gwModel}}
                {{#if gwModel.isValid}}
                <div class="item-views-option-gift-wrap-message-label">
                    {{gwModel.price_formatted}}
                </div>
                {{/if}}
            {{/if}}
        </div>
        {{else}}
        <span>{{translate 'Gift wrap unavailable.'}}</span>
        {{/if}}
    {{else}}
        <div class="item-views-option-dropdown-gift-wrap-label-wrapper">
            <select
                name="{{cartOptionId}}"
                id="{{cartOptionId}}"
                class="product-views-option-dropdown-select"
                data-toggle="select-option">

                {{#each values}}
                    {{#unless label}}
                        <option value="">
                            {{translate '--None--'}}
                        </option>
                    {{/unless}}
                    {{#if internalId}}
                        <option
                            class="{{#if isActive}}active{{/if}} {{#unless isAvailable}}muted{{/unless}}"
                            value="{{internalId}}"
                            {{#if isActive}}selected{{/if}}
                            data-active="{{isActive}}"
                            data-available="{{isAvailable}}">
                            {{label}}
                            {{#if gwModel}}
                                {{gwModel.price_formatted}}
                            {{/if}}
                        </option>
                    {{/if}}
                {{/each}}

            </select>
        </div>
    {{/if}}
    </div>
{{/if}}
