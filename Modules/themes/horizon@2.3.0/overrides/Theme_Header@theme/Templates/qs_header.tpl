{{!
    © 2017 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
}}

<div class="header-message" data-view="Message.Placeholder"></div>

<div class="header-main-wrapper">
    <nav class="header-main-nav">

        <div class="header-sidebar-toggle-wrapper">
            <button class="header-sidebar-toggle" data-action="header-sidebar-show">
                <i class="header-sidebar-toggle-icon"></i>
            </button>
        </div>

        <div class="header-content">
            <div class="header-logo-wrapper">
                <div data-view="Header.Logo"></div>
            </div>

            <div class="header-left-content">
                {{#if bannertext}}<p>{{bannertext}}</p>{{/if}}
            </div>

            <div class="header-right-menu">
                <div class="header-menu-profile" data-view="Header.Profile"></div>
                <ul class="header-right-menu-options">
                    <li class="header-menu-storelocator-list-item" data-view="StoreLocatorHeaderLink"></li>
                    <li data-view="RequestQuoteWizardHeaderLink">{{translate 'Request a Quote'}}</li>
                    {{#if showLanguagesOrCurrencies}}
                        <li class="header-subheader-settings">
                            <a href="#" class="header-subheader-settings-link" data-toggle="dropdown" title="{{translate 'Settings'}}">
                                <i class="header-menu-settings-icon"></i>
                                <i class="header-menu-settings-carret"></i>
                            </a>
                            <div class="header-menu-settings-dropdown">
                                <h5 class="header-menu-settings-dropdown-title">{{translate 'Site Settings'}}</h5>
                                {{#if showLanguages}}
                                    <div data-view="Global.HostSelector"></div>
                                {{/if}}
                                {{#if showCurrencies}}
                                    <div data-view="Global.CurrencySelector"></div>
                                {{/if}}
                            </div>
                        </li>
                    {{/if}}
                    <li data-view="QuickOrderHeaderLink"></li>
                </ul>

                <div class="header-menu-locator-mobile" data-view="StoreLocatorHeaderLink"></div>
                <div class="header-menu-searchmobile">
                    <button class="header-menu-searchmobile-link" data-action="show-sitesearch" title="{{translate 'Search'}}">
                        <i class="header-menu-searchmobile-icon"></i>
                    </button>
                </div>

                <div class="header-menu-cart">
                    <div class="header-menu-cart-dropdown">
                        <div data-view="Header.MiniCart"></div>
                    </div>
                </div>
            </div>

        </div>
    </nav>
</div>

<div class="header-secondary-wrapper" data-view="Header.Menu" data-phone-template="header_sidebar" data-tablet-template="header_sidebar"></div>
<div class="header-sidebar-overlay" data-action="header-sidebar-hide"></div>

<div class="header-site-search" data-view="SiteSearch" data-type="SiteSearch"></div>
