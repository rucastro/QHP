{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}
<div class="about-us-container">
    <header class="about-us-header">
        <h1 class="about-us-title">{{pageHeader}}</h1>

        <div id="about-us-header-cms" class="about-us-header-cms" data-cms-area="about-us-header-cms" data-cms-area-filters="path"></div>
    </header>

    <div class="about-us-content">

        <div id="about-us-cms" class="contact-us-cms" data-cms-area="about-us-cms" data-cms-area-filters="path"></div>
        <div class="about-us-alert-placeholder" data-type="alert-placeholder"></div>

		{{#if aboutUsText}}
		<div class="about-us-content-text">
				{{{aboutUsText}}}
		</div>
		{{/if}}

		{{#if aboutUsStaff}}
		<!-- OUR STAFF BEGINS -->
		<h2 class="about-staff-title">Our Staff</h2>
	    <div class="about-us-staff-container">
	        <div class="row">
				{{#each aboutUsStaff}}
	            <div class="staff-employee-cell">
					<div class="staff-employee-container">
	                    <img src="{{../url}}{{image}}" alt="Employee Name - Job Title" />
	                    <div class="staff-employee-details">
	                        <h5>{{name}}</h5>
	                        <p>{{jobtitle}}</p>
	                    </div>
	                </div>
				</div>
				{{/each}}
			</div>
		</div>
		<!-- OUR STAFF ENDS -->
		{{/if}}

		{{#if aboutUsBottomContent}}
		<!-- ABOUT US BOTTOM CONTENT BEGINS -->
	    <div class="about-us-bottom-content">
	        <div class="row">
				{{#each aboutUsBottomContent}}
				<a href="{{href}}" class="about-us-bottom-content-link">
		            <div class="about-us-bottom-content-col" style="background-image: url({{../url}}{{image}});">
						<div class="about-us-bottom-content-text-cell">
							<div class="about-us-bottom-content-text-info">
								<h3 class="about-us-bottom-content-text">
									{{text}}
								</h3>
							</div>
						</div>
		            </div>
				</a>
				{{/each}}
	        </div>
	    </div>
	    <!-- ABOUT US BOTTOM CONTENT ENDS -->
		{{/if}}

    </div>

</div>
