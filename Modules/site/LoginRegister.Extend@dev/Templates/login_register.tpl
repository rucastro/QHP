{{!
© 2017 NetSuite Inc.
User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
provided, however, if you are an authorized user with a NetSuite account or log-in, you
may use this code subject to the terms that govern your access and use.
}}

<section class="login-register" >

    <header class="login-register-header">
        {{#if showRegister}}
        <h1 class="login-register-title"> {{translate 'Log in | Register'}}</h1>
        {{else}}
        <h1 class="login-register-title"> {{translate 'Log in'}}</h1>
        {{/if}}
    </header>

    <div {{#if showRegister}} class="login-register-body" {{else}} class="login-register-body-colored" {{/if}}>

    {{#if showLogin}}
    <div class="login-register-wrapper-column-login">
        <div class="login-register-wrapper-login" data-view="Login"></div>
    </div>
    <div class="login-register-wrapper-column-login">
        <div class="login-register-wrapper-log-in">
            <div class="returning-cust-without-login">
                <h2 class="login-register-login-title">Already a hole products customer? Great.</h2>
                <p class="login-register-login-description">Click here to unlock the anywhere advantage.</p>
                <div class="container-fluid">
                    <a href="/returning-customer-no-login" class="login-register-login-submit">UNLOCK</a>
                </div>
            </div>
            <div class="new-member">
                <h2 class="login-register-login-title">New to Hole Products? No problem.</h2>
                <p class="login-register-login-description">Let us help you get started.</p>
                <div class="container-fluid">
                    <a href="/customer-new-to-hole-products" class="login-register-login-submit">Apply</a>
                </div>
            </div>
        </div>
    </div>
    {{/if}}

    {{#if showRegisterOrGuest}}
    <div class="login-register-wrapper-column-register">
        <div class="login-register-wrapper-register">
            <h2 class="login-register-title-register">{{translate 'New customer'}}</h2>

            {{#if showCheckoutAsGuest}}
            <div class="login-register-wrapper-guest" data-view="CheckoutAsGuest"></div>
            {{/if}}

            {{#if showRegister}}
            <div class="{{#if showCheckoutAsGuest}}collapse{{/if}} " data-view="Register" id="register-view"></div>
            {{/if}}
        </div>
    </div>
    {{/if}}

    </div>
</section>



{{!----
Use the following context variables when customizing this template:

showRegister (Boolean)
showCheckoutAsGuest (Boolean)
showLogin (Boolean)
showRegisterOrGuest (Boolean)

----}}
