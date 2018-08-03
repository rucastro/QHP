<div class="guest-order-status-layout-container">

    <div class="guest-order-status-container">
        <div class="guest-order-status-header">
            <h1 class="guest-order-status-title">{{ translate 'Order Status'}}</h1>
            <p>{{translate 'To see the status of a recent order, enter your order number and either the email address used when placing your order or the zipcode of the shipping address for the order.'}}</p>
            <p>{{translate 'If you have an account, you may ' }}<a class="guest-order-status-login-link" data-touchpoint="login" data-hashtag="login-register" href="#">{{translate 'login to view your entire order history'}}</a>{{translate ' with more complete details.'}}</p>
        </div>
    </div>

    <div class="guest-order-status-container">

        <div class="guest-order-status-form">

            <section class="guest-order-status-form-fields">

            <div data-type="alert-placeholder"></div>

            <small class="guest-order-status-required-text">{{translate 'Required'}} <span class="guest-order-status-required">*</span></small>
                <form>
                    <fieldset>

                        <div class="guest-order-status-group" data-validation="control-group">
                            <label class="guest-order-status-label" for="orderid">
                                {{ translate 'Order Number'}} <span class="guest-order-status-required">*</span>
                            </label>
                            <div class="guest-order-status-form-controls" data-validation="control">
                                <input class="guest-order-status-input" type="text" name="orderid" id="orderid" value="{{orderid}}"/>
                            </div>
                        </div>
                        {{#unless isBOPISEnabled}}
                        <div class="guest-order-status-group" data-validation="control-group">
                            <label class="guest-order-status-label" data-validation="control-label" for="secondField">
                                {{ translate 'Additional Info'}}
                            </label>
                            <div class="guest-order-status-form-controls" data-validation="control">
                                <select class="guest-order-status-input" name="secondField" id="secondField">
                                    {{#each secondFields}}
                                        <option value="{{id}}">{{translate name}}</option>
                                    {{/each}}
                                </select>
                            </div>
                        </div>
                        {{/unless}}

                        {{#each secondFields}}
                        <div class="guest-order-status-group" data-validation="control-group" data-secondary="T" data-secondary-value="{{id}}">
                            <label class="guest-order-status-label" class="control-label" for="{{id}}">
                                {{translate name}} <span class="guest-order-status-required">*</span>
                            </label>
                            <div class="guest-order-status-form-controls" data-validation="control">
                                <input class="guest-order-status-input" type="text" name="{{id}}" id="{{id}}"/>
                            </div>
                        </div>
                        {{/each}}

                        <div class="form-actions">
                            <button type="submit" class="guest-order-status-submit">
                                {{ translate 'Submit'}}
                            </button>
                            <button type="reset" class="guest-order-status-reset" data-action="reset">
                                {{ translate 'Reset'}}
                            </button>
                        </div>
                    </fieldset>
                </form>
            </section>
        </div>
        <div class="guest-order-status-details">
            <div data-view="GuestOrderStatus.Details"></div>
        </div>
    </div>
</div>