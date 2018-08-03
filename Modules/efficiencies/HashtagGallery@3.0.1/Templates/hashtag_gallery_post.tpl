<a href="" data-action="show-modal" data-toggle="show-in-modal">
    {{#if checkImage}}
        <img src="{{lowresasset}}" alt="{{username}} {{caption}}">
    {{else}}
        <img src="{{noImage}}" alt="{{username}} {{caption}}">
    {{/if}}
</a>
{{#if displayUser}}
    <div class="hashtag-gallery-user">
        {{#if userpic}}
            <div class="hashtag-gallery-user-pic"><img src="{{userpic}}" alt="{{username}}"></div>
        {{/if}}
        <div class="hashtag-gallery-user-link"><a href="https://instagram.com/{{username}}/" target="_blank">{{username}}</a></div>
    </div>
    {{/if}}
    {{#if displayCaption}}
        <small class="hashtag-gallery-post-caption">{{caption}}</small>
{{/if}}