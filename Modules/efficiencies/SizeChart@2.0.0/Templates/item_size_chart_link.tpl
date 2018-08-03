{{#if internalid}}
    <a href="/sizecharts/{{internalid}}" data-toggle="show-in-modal" class="item-details-size-chart-link">
        {{#if linkText}}
            {{linkText}}
        {{else}}
            {{translate "Size chart: $(0)" name}}
        {{/if}}
    </a>
{{/if}}