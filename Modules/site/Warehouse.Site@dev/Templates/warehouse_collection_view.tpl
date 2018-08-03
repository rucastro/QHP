{{#if active}}

<div class="order-wizard-warehouse-module">
    <div data-type="alert-placeholder"></div>

    <div class="order-wizard-warehouse-header">
        <h3 class="order-wizard-warehouse-header-title">
            {{name}}
        </h3>

        <select class="order-wizard-warehouse-header-delivery-method" data-toggle="select-ship-method-option" warehouse-id="{{warehouseId}}">
            {{# each shipMethods}}
                <option value="{{id}}"
                    {{#if selected}}
                        selected
                    {{/ if}}
                >{{name}} - {{rateFormatted}}</option>
            {{/each}}
        </select>
    </div>

    <div class="order-wizard-warehouse-body">
        <div class="order-wizard-cartitems-module-ship-products-scroll">
            <table class="{{#if showMobile}}lg2sm-first{{/if}} order-wizard-cartitems-module-ship-table">
                <tbody data-view="Items.Collection"></tbody>
            </table>
        </div>
    </div>


</div>
{{/if}}