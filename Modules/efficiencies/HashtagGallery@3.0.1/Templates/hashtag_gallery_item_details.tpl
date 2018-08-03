{{#if hasHashtag}}
<div id="hashtag-gallery">
    <div class="hashtag-gallery-header">
        <div class="hashtag-gallery-intro">
            <p>
                {{ translate 'Tag your photos in Instagram using $(0)' hashtag }}
                <!-- shows total per page {{ translate 'total $(0)' total }}-->
            </p>
        </div>
        <div class="hashtag-gallery-pagination">
            <div data-view="GlobalViews.Pagination"></div>
        </div>
    </div>
    <!-- Gallery starts -->
    <div data-view="Hashtag.Gallery"></div>
    <!-- Gallery ends -->
    <div class="hashtag-gallery-footer">
        <div class="hashtag-gallery-pagination">
            <div data-view="GlobalViews.Pagination"></div>
        </div>
    </div>
</div>
{{/if}}