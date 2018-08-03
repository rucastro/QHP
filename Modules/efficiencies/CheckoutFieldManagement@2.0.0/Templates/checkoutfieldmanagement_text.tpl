
<div class="checkoutfieldmanagement-text-line" data-validation="control-group">
    <label class="checkoutfieldmanagement-text-label" for="{{id}}">{{translate text}}{{#if required}}<small class="checkoutfieldmanagement-required-marker"> *</small>{{/if}}</label>
    <div class="checkoutfieldmanagement-text-control-container" data-validation="control">
        <input class="checkoutfieldmanagement-text-input"
               type="text"
               id="{{id}}"
               name="{{id}}"
               data-checkoutfieldmanagement="{{id}}"
               maxlength="300"
               value="{{translate defaultValue}}"
               {{#if readOnly}}disabled="true"{{/if}}/>
        <p class="checkoutfieldmanagement-text-help">{{translate help}}</p>
    </div>
</div>
