/**
 * @NApiVersion 2.0
 * @NScriptName EF - SMH | HashtagGallery Model
 * @NScriptId _hashtag_gallery_model
 * @NModuleScope Public
 */

define([
    'N/search',
    'N/record',
    'N/format',
    './../libraries/underscore-nonamed-define'
], function HashtagGalleryModel(
    search,
    record,
    formatter,
    _
) {
    'use strict';

    /*
    var STATUS = {
        Approved: 1,
        Rejected: 3,
        Pending: 2
    };
    */

    var recordType = 'customrecord_ef_social_media_post';
    var getIdFromFeed = function fromFeed(feed, hashtag) {
        return feed.network + ':' + feed.externalid + ':' + hashtag;
    };

    var getFeedIds = function getFeedIds(feeds, hashtag) {
        return feeds.map(function map(f) {
            return getIdFromFeed(f, hashtag);
        });
    };

    var map = function map(result) {
        return {
            internalid: result.getValue('internalid'),
            name: result.getValue('name'),
            hashtag: result.getText('custrecord_ef_smp_hashtag'),
            network: result.getValue('custrecord_ef_smp_network'),

            assetUrl: result.getValue('custrecord_ef_smp_asset'),
            lowResAssetUrl: result.getValue('custrecord_ef_smp_asset_low_res'),
            thumbnailAssetUrl: result.getValue('custrecord_ef_smp_asset_thumb'),

            caption: result.getValue('custrecord_ef_smp_caption'),
            userName: result.getValue('custrecord_ef_smp_username'),
            userId: result.getValue('custrecord_ef_smp_userid'),
            userPic: result.getValue('custrecord_ef_smp_user_pic'),
            userFullName: result.getValue('custrecord_ef_smp_fullname'),
            status: result.getValue('custrecord_ef_smp_status'),
            externalid: result.getValue('custrecord_ef_smp_external_id'),
            link: result.getValue('custrecord_ef_smp_post_link'),
            createdDate: result.getValue('custrecord_ef_smp_created_date')

        };
        /*

         */
    };

    return {

        create: function create(data) {
            var instance;
            if (data.internalid) {
                instance = record.load({ type: recordType, id: data.internalid });
            } else {
                instance = record.create({ type: recordType, isDynamic: false });
            }

            // validation and mapping

            instance.setValue('name', getIdFromFeed(data, data.hashtag));
            instance.setText('custrecord_ef_smp_hashtag', data.hashtag);

            instance.setValue('custrecord_ef_smp_network', data.network);
            instance.setValue('custrecord_ef_smp_external_id', data.externalid);
            instance.setValue('custrecord_ef_smp_asset', data.assetUrl);
            instance.setValue('custrecord_ef_smp_asset_low_res', data.lowResAssetUrl);
            instance.setValue('custrecord_ef_smp_asset_thumb', data.thumbnailAssetUrl);
            instance.setValue('custrecord_ef_smp_post_link', data.link);
            instance.setValue('custrecord_ef_smp_caption', data.caption);

            instance.setValue('custrecord_ef_smp_username', data.userName);

            instance.setValue('custrecord_ef_smp_userid', data.userId);
            instance.setValue('custrecord_ef_smp_user_pic', data.userPic);
            instance.setValue('custrecord_ef_smp_fullname', data.userFullName);
            instance.setValue('custrecord_ef_smp_status', data.status);

            instance.setValue('custrecord_ef_smp_created_date', formatter.parse({
                type: formatter.Type.DATETIMETZ,
                value: data.createdDate,
                timezone: formatter.Timezone.GMT
            }));

            instance.setValue('custrecord_ef_smp_external_id', data.externalid);

            return instance.save();
        },

        /*
        list: function list(hashtag) {
            var results = search.create({
                type: recordType,
                columns: [
                    'internalid',
                    'name',
                    'custrecord_ef_smp_hashtag',
                    'custrecord_ef_smp_network',
                    'custrecord_ef_smp_external_id',
                    'custrecord_ef_smp_asset',
                    'custrecord_ef_smp_asset_low_res',
                    'custrecord_ef_smp_asset_thumb',
                    'custrecord_ef_smp_post_link',
                    'custrecord_ef_smp_caption',
                    'custrecord_ef_smp_username',
                    'custrecord_ef_smp_userid',
                    'custrecord_ef_smp_user_pic',
                    'custrecord_ef_smp_fullname',
                    'custrecord_ef_smp_status',
                    'custrecord_ef_smp_created_date',
                    'custrecord_ef_smp_external_id'
                ], filters: [
                    search.createFilter({
                        name: 'name',
                        operator: search.Operator.ANY,
                        values: getFeedIds(feeds, hashtag)
                    })
                ]
            }).run();

            results.each(function each(result) {
                // hashMap[result.getValue('name')] = map(result);
                return true;
            });
        },
        */

        attachRecordToFeeds: function attachRecordToFeed(feeds, hashtag) {
            var hashMap = {};
            var results = search.create({
                type: recordType,
                columns: [
                    'internalid',
                    'name',
                    'custrecord_ef_smp_hashtag',
                    'custrecord_ef_smp_network',
                    'custrecord_ef_smp_external_id',
                    'custrecord_ef_smp_asset',
                    'custrecord_ef_smp_asset_low_res',
                    'custrecord_ef_smp_asset_thumb',
                    'custrecord_ef_smp_post_link',
                    'custrecord_ef_smp_caption',
                    'custrecord_ef_smp_username',
                    'custrecord_ef_smp_userid',
                    'custrecord_ef_smp_user_pic',
                    'custrecord_ef_smp_fullname',
                    'custrecord_ef_smp_status',
                    'custrecord_ef_smp_created_date',
                    'custrecord_ef_smp_external_id'
                ],
                filters: [
                    search.createFilter({
                        name: 'name',
                        operator: search.Operator.ANY,
                        values: getFeedIds(feeds, hashtag)
                    })
                ]
            }).run();

            results.each(function each(result) {
                hashMap[result.getValue('name')] = map(result);
                return true;
            });

            _.each(feeds, function each(f) {
                var entry = hashMap[getIdFromFeed(f, hashtag)];
                if (entry) {
                    _.extend(f, entry);
                }
            });

            return feeds;
        }
    };
});
