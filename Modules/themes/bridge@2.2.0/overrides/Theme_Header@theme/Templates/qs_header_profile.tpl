{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}
<!--
There is no place for this in the design for Bridge
{{translate 'Welcome <strong class="header-profile-welcome-name">$(0)</strong>' displayName}}
-->
<ul class="header-profile">
{{#if showExtendedMenu}}
	<li class="header-profile-list-item header-profile-list-item-welcome">
		<a class="header-profile-welcome-link" href="#" data-toggle="dropdown">
			<i class="header-profile-welcome-icon"></i>
			<span class="header-profile-welcome-name-wrapper">
				{{translate 'Welcome <strong class="header-profile-welcome-link-name">$(0)</strong>' displayName}}
			</span>
			<i class="header-profile-welcome-carret-icon"></i>
		</a>
	</li>

	{{#if showMyAccountMenu}}
		<ul class="header-profile-menu-myaccount-container">
			<li class="header-profile-menu-myaccount" data-view="Header.Menu.MyAccount"></li>
		</ul>
	{{/if}}

{{else}}

	{{#if showLoginMenu}}
		{{#if showLogin}}
			<li class="header-profile-list-item">
				<a class="header-profile-login-link" data-touchpoint="login" data-hashtag="login-register" href="#" title="{{translate 'Login'}}">
						{{translate 'Login'}}
				</a>
			</li>{{#if showRegister}}<li class="header-profile-list-item"><!-- not pretty markup, but fixes whitespace bug -->
				<a class="header-profile-register-link" data-touchpoint="register" data-hashtag="login-register" href="#" title="{{translate 'Register'}}">
					{{translate 'Register'}}
				</a>
			</li>{{/if}}
		{{/if}}
	{{else}}
		<li class="header-profile-list-item">
			<a class="header-profile-loading-link">
				<i class="header-profile-loading-icon"></i>
			</a>
		</li>
	{{/if}}

{{/if}}
</ul>
