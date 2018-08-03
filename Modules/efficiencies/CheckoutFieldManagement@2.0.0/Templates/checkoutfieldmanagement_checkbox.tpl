
<div class="checkoutfieldmanagement-checkbox-line" data-validation="control-group">
    <div class="checkoutfieldmanagement-checkbox-control-container" data-validation="control">
        <label class="checkoutfieldmanagement-checkbox-label">
            <input class="checkoutfieldmanagement-checkbox-input"
                   type="checkbox"
                   id="{{id}}"
                   name="{{id}}"
                   data-checkoutfieldmanagement="{{id}}"
                   value="T"
                   data-unchecked-value="F"
                   {{#checkoutfieldmanagement_isequal defaultValue 'T'}}checked="checked"{{/checkoutfieldmanagement_isequal}}
                   {{#if readOnly}}disabled="true"{{/if}}/>
            {{translate text}}{{#if required}}<small class="checkoutfieldmanagement-required-marker"> *</small>{{/if}}
        </label>
        <p class="checkoutfieldmanagement-checkbox-help">{{translate help}}</p>
    </div>
</div>
