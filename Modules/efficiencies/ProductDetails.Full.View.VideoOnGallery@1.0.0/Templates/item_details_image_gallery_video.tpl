{{!
	© 2015 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}
<div class="item-details-image-gallery">
	{{#if showImages}}
		{{#if showImageSlider}}
			<ul class="bxslider" data-slider>
				{{#each images}}
				    {{#if isVideo}}
				    <li>
                        <div class="videoContainer">
                            <iframe src="{{url}}" width="555" height="555" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
                        </div>
                    </li>
					{{else}}
                        <li data-zoom>
                            <img
                                src="{{resizeImage url ../../imageResizeId}}"
                                alt="{{altimagetext}}"
                                itemprop="image"
                                data-loader="false">
                        </li>
					{{/if}}
				{{/each}}
			</ul>
		{{else}}
			{{#with firstImage}}
			    {{#if isVideo}}
                    <div class="videoContainer">
                        <iframe src="{{url}}" width="555" height="555" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
                    </div>
			    {{else}}
                    <div class="item-details-image-gallery-detailed-image " data-zoom>
                        <img
                            class="center-block"
                            src="{{resizeImage url ../../imageResizeId}}"
                            alt="{{altimagetext}}"
                            itemprop="image"
                            data-loader="false">
                    </div>
			    {{/if}}
			{{/with}}
		{{/if}}
	{{/if}}
	<div data-view="SocialSharing.Flyout.Hover"></div>
</div>
