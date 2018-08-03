<tr>
    <td class="back-in-stock-notification-td-first">
        <div class="back-in-stock-notification-thumbnail">
            <img src="{{resizeImage thumbnail.url 'thumbnail'}}" alt="{{thumbnail.altimagetext}}">
        </div>
    </td>
    <td class="back-in-stock-notification-td-middle">
        <div class="back-in-stock-notification-name">
            <a class="product-list-display-full-name-anchor" href="{{link}}" data-touchpoint="home" data-hashtag="#{{link}}">
                {{itemName}}
            </a>
        </div>
        <div class="back-in-stock-notification-price">
            <span class="back-in-stock-notification-price-lead">{{itemPrice}}</span>
        </div>
        <div class="back-in-stock-notification-data">
            <span class="back-in-stock-notification-data-label">{{translate 'Date'}}: </span>
            <span class="back-in-stock-notification-data-value">{{created}}</span>
        </div>
        <div class="back-in-stock-notification-data">
            <span class="back-in-stock-notification-data-label">{{translate 'Contact'}}: </span>
            <span class="back-in-stock-notification-data-value">{{firstName}} {{lastName}} &lt;{{email}}&gt;</span>
        </div>
    </td>
    <td class="back-in-stock-notification-td-last">
        <div class="back-in-stock-notification-button-container">
            <button class="back-in-stock-notification-delete" data-type="backinstock-delete" data-id="{{internalId}}">{{translate 'Delete'}}</button>
        </div>
    </td>
</tr>
