{{#unless hideOption}}
<a
    href="{{editUrl}}&gwm=true"
    data-toggle="show-in-modal"
    class="cart-item-actions-item-list-actionable-edit-button-edit">
    {{#if hasGiftwrap}}
        {{translate 'Gift Options'}}
    {{else}}
        {{translate 'Make a Gift'}}
    {{/if}}
</a>
{{/unless}}
