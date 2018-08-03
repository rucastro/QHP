<div>
    <label for="name">Post By: </label>
    <small id="name">{{username}}</small>
</div>
<div>
    <label for="date">Date: </label>
    <small id="date">{{dateCreated}}</small>
</div>
<div>
    {{#if displayCaption}}
        <label for="caption">Caption: </label>
        <small id="caption">{{caption}}</small>
    {{/if}}
</div>
<div>
    <label for="link">Link: </label>
    <small id="link"><a href="{{link}}" target="_blank">{{link}}</a></small>
</div>
{{#if checkImage}}
    <img src="{{asset}}" alt="{{username}} {{caption}}">
{{else}}
    <img src="{{noImage}}" alt="{{username}} {{caption}}">
{{/if}}