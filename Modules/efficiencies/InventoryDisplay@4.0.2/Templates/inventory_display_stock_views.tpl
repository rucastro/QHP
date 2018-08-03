{{!
    © 2017 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
}}

<div class="product-line-stock">
    {{#if isNotAvailableInStore}}
        <div class='product-line-stock-msg-not-available'>{{translate 'This item is no longer available'}}</div>
    {{else}}
        {{#if showOutOfStockMessage}}
           {{#if showInStockMessage}}
                <p class="product-line-stock-msg-in">
                    <span class="product-line-stock-icon-in">
                        <i></i>
                    </span>
                    {{inStockMessage}}
                </p>
                <p>
                    <small>
                        {{ translate 'Available: $(0)' stockAvailable}}
                    </small>
                </p>
            {{/if}}
        {{/if}}
    {{/if}}
</div>
