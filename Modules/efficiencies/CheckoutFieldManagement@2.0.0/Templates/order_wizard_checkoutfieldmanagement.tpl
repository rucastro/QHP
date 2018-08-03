
<div class="order-wizard-checkoutfieldmanagement">
    <div data-type="alert-placeholder"></div>

    <h3 class="order-wizard-checkoutfieldmanagement-title">
        {{translate title}}
    </h3>

    {{#if isLoaded}}
        <div data-view="CheckoutFieldManagementView"></div>
    {{else}}
        <div class="order-wizard-checkoutfieldmanagement-message">
            {{#if isLoading}}
                {{translate 'Loading...'}}
            {{else}}
                {{translate 'Could not load additional information fields.'}}
            {{/if}}
        </div>
    {{/if}}

    {{#if readOnly}}
	<a data-action="edit-module" href="{{{editUrl}}}?force=true" class="order-wizard-checkoutfieldmanagement-edit-link">
	    {{translate 'Back to edit $(0)' title}}
	</a>
    {{/if}}
</div>
