define('HashtagGallery.Model', [
    'SC.Model',
    'SearchHelper',
    'underscore',
    'Configuration'
], function HashtagGalleryModel(
    SCModel,
    SearchHelper,
    _,
    Configuration
) {
    'use strict';

    var STATUS = {
        Approved: '1',
        Rejected: '3',
        Pending: '2'
    };

    // @extends SCModel
    return SCModel.extend({
        name: 'HashtagGallery',
        record: 'customrecord_ef_social_media_post',
        filters: [
            { fieldName: 'isinactive', operator: 'is', value1: 'F' }
        ],
        results_per_page: Configuration && Configuration.get('hashtagGallery'),
        sort: 'custrecord_ef_smp_created_date',
        sortOrder: 'desc',
        columns: {
            internalid: { fieldName: 'internalid' },
            externalid: { fieldName: 'custrecord_ef_smp_external_id' },
            hashtag: { fieldName: 'custrecord_ef_smp_hashtag' },
            status: { fieldName: 'custrecord_ef_smp_status' },
            asset: { fieldName: 'custrecord_ef_smp_asset' },
            lowresAsset: { fieldName: 'custrecord_ef_smp_asset_low_res' },
            thumbAsset: { fieldName: 'custrecord_ef_smp_asset_thumb' },
            createdDate: { fieldName: 'custrecord_ef_smp_created_date' },
            link: { fieldName: 'custrecord_ef_smp_post_link' },
            userName: { fieldName: 'custrecord_ef_smp_username' },
            fullName: { fieldName: 'custrecord_ef_smp_fullname' },
            caption: { fieldName: 'custrecord_ef_smp_caption' },
            userPic: { fieldName: 'custrecord_ef_smp_user_pic' }
        },
        search: function list(hashtags, page) {
            var filters = _.clone(this.filters);
            var search;
            var result;

            filters.push({ fieldName: 'custrecord_ef_smp_status', operator: 'is', value1: STATUS.Approved });
            filters.push({ fieldName: 'name', joinKey: 'custrecord_ef_smp_hashtag', operator: 'is', value1: hashtags });

            search = new SearchHelper(
                this.record,
                filters,
                this.columns,
                null,
                this.results_per_page.resultsPerPage,
                page || 1,
                this.sort,
                this.sortOrder
            ).search();

            result = search.getResultsForListHeader();
            result.hashtags = hashtags;


            return result;
        }
    });
});

