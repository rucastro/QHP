
<div class="checkoutfieldmanagement-select-line" data-validation="control-group">
    <label class="checkoutfieldmanagement-select-label" for="{{id}}">{{translate text}}{{#if required}}<small class="checkoutfieldmanagement-required-marker"> *</small>{{/if}}</label>
    <div class="checkoutfieldmanagement-select-control-container" data-validation="control">
        <select class="checkoutfieldmanagement-select-input"
                id="{{id}}"
                name="{{id}}"
                data-checkoutfieldmanagement="{{id}}"
                {{#if readOnly}}disabled="true"{{/if}}>
            <option value="">{{translate '-- Select --'}}</option>
            {{#each options}}
            <option value="{{id}}"{{#checkoutfieldmanagement_isequal id ../defaultValue}} selected="selected"{{/checkoutfieldmanagement_isequal}}>{{translate text}}</option>
            {{/each}}
        </select>
        <p class="checkoutfieldmanagement-select-help">{{translate help}}</p>
    </div>
</div>
