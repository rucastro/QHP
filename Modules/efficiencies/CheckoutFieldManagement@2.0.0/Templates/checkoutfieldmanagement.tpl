
<small class="checkoutfieldmanagement-required">
    {{translate 'Required '}}<span class="checkoutfieldmanagement-required-marker">*</span>
</small>

<fieldset data-fieldset-type="checkoutfieldmanagement">
    {{#each collection}}
    <div data-view="{{translate 'CheckoutFieldManagement.$(0).View' this.id}}"></div>
    {{/each}}
</fieldset>
