{{#if hasWarehouses}}

    <div data-view="Warehouse.Collection" class="order-wizard-warehouse-collection-container"></div>

{{else}}

    <div class="order-wizard-warehouse-module-parent">
        <div data-type="alert-placeholder"></div>

        <h3 class="order-wizard-warehouse-title">
            {{title}}
        </h3>

        <div class="order-wizard-warehouse-module-message">
            {{translate 'Calculating the most economical freight options...'}}
        </div>
    </div>

{{/if}}




