<div class="guest-order-status-summary-container">
    <h3 class="guest-order-status-summary-title">{{translate 'Your Order Status'}}</h3>
    {{#each details}}
        {{#if render}}
            <div class="guest-order-status-summary-line">
                <div class="guest-order-status-summary-line-name">{{translate name}}</div>
                <div class="guest-order-status-summary-line-value">{{{value}}}</div>
            </div>
        {{/if}}
    {{/each}}
</div>