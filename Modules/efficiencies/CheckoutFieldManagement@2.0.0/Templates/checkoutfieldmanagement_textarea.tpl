
<div class="checkoutfieldmanagement-textarea-line" data-validation="control-group">
    <label class="checkoutfieldmanagement-textarea-label" for="{{id}}">{{translate text}}{{#if required}}<small class="checkoutfieldmanagement-required-marker"> *</small>{{/if}}</label>
    <div class="checkoutfieldmanagement-textarea-control-container" data-validation="control">
        <textarea class="checkoutfieldmanagement-textarea-input"
                  id="{{id}}"
                  name="{{id}}"
                  data-checkoutfieldmanagement="{{id}}"
                  {{#if readOnly}}disabled="true"{{/if}}>
            {{translate defaultValue}}
        </textarea>
        <p class="checkoutfieldmanagement-textarea-help">{{translate help}}</p>
    </div>
</div>
