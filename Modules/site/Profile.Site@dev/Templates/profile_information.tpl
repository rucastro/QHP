{{!
	© 2017 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if showBackToAccount}}
	<a href="/" class="profile-information-button-back">
		<i class="profile-information-button-back-icon"></i>
		{{translate 'Back to Account'}}
	</a>
{{/if}}

<div class="profile-information">
<h2 class="profile-information-header">{{pageHeader}}</h2>

<div data-type="alert-placeholder"></div>
<section class="profile-information-row-fluid">

	<div class="profile-information-col">
		<form class="contact_info">
			<fieldset>
				{{#if isNotCompany}}
					<div class="profile-information-row">
						<label class="profile-information-label">{{translate 'First Name'}}: </label>
						<div class="profile-information-group-form-controls" >
							<p class="profile-information-input-email">{{firstName}}</p>
						</div>
					</div>

					<div class="profile-information-row">
						<label class="profile-information-label">{{translate 'Last Name'}}: </label>
						<div class="profile-information-group-form-controls">
							<p class="profile-information-input-email">{{lastName}}</p>
						</div>
					</div>
				{{/if}}

				{{#if isCompanyAndShowCompanyField}}
					<div class="profile-information-row">
						<label class="profile-information-label">{{translate 'Company Name'}}: </label>
						<div class="profile-information-group-form-controls">
							<p class="profile-information-input-email">{{companyName}}</p>
						</div>
					</div>
				{{/if}}

				<div class="profile-information-row">
					<label class="profile-information-label">
						{{translate 'Phone Number'}}: 
					<div class="profile-information-group-form-controls">
						<p class="profile-information-input-email">{{phone}}</p>
					</div>
				</div>
				<div class="profile-information-row">
					<label class="profile-information-label">{{translate 'Email'}}: </label>
					<p class="profile-information-input-email">{{email}}</p>
				</div>
			</fieldset>
		</form>
	</div>
</section>
</div>




{{!----
Use the following context variables when customizing this template: 
	
	pageHeader (String)
	isNotCompany (Boolean)
	phoneFormat (undefined)
	isCompanyAndShowCompanyField (Boolean)
	isCompanyFieldRequired (Boolean)
	isPhoneFieldRequired (Boolean)
	firstName (String)
	lastName (String)
	companyName (String)
	email (String)
	phone (String)
	showBackToAccount (Boolean)

----}}
