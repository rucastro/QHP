/**
 * @NApiVersion 2.0
 * @NScriptName EF - SHG - SL | Hashtag Gallery Service
 * @NScriptId _ef_shg_sl_hashtag_gallery_s
 * @NScriptType Suitelet
 * @NModuleScope Public
 */
define([
    'N/http',
    'N/runtime',
    'N/file',
    'N/error',
    './../libraries/InstagramAPI',
    './../libraries/HashtagGallery.Model'
], function Suitelet(
    http,
    runtime,
    file,
    error,
    InstagramAPI,
    HashtagGalleryModel
) {
    'use strict';

    var extend = function extend(src, cp) {
        var i;
        for (i in cp) {  // eslint-disable-line
            if (cp.hasOwnProperty(i)) {  // eslint-disable-line
                src[i] = cp[i];
            }
        }
    };

    return {
        onRequest: function onRequest(context) {
            var res;
            var media;
            var requestData;
            var status;
            var credentials;
            var bundleId = (runtime.getCurrentScript().bundleIds
                && runtime.getCurrentScript().bundleIds[0]) || '93280';
            var credentialsFile;
            var indexPath = 'SuiteBundles/Bundle ' + bundleId + '/config/.apicredentials.json';


            try {
                credentialsFile = file.load(indexPath);
                credentials = JSON.parse(credentialsFile.getContents());
            } catch (e) {
                throw new error.create({ name: 'CONFIG_FILE', message: 'Need valid file for API' });
            }

            InstagramAPI.setCredentials(credentials.instagram);

            try {
                requestData = JSON.parse(context.request.body);
            } catch (e) {
                requestData = {};
            }

            switch (context.request.method) {
            case http.Method.GET:

                if (context.request.parameters.id) {
                    res = InstagramAPI.getMediaById(context.request.parameters.id);
                    context.response.write(JSON.stringify(res));
                } else if (context.request.parameters.hashtag) {
                    switch (status) {
                    case 'moderated':
                        res = HashtagGalleryModel.list(
                            context.request.parameters.hashtag, {
                                pagerId: context.request.parameters.pagerId,
                                page: context.request.parameters.page
                            });

                        break;
                    default: // case 'all'
                        res = InstagramAPI.getRecentsByHashtag(
                            context.request.parameters.hashtag, {
                                pagerId: context.request.parameters.pagerId,
                                page: context.request.parameters.page
                            }
                        );
                        HashtagGalleryModel.attachRecordToFeeds(res.results, context.request.parameters.hashtag);
                        break;
                    }
                    context.response.write(JSON.stringify(res));
                }
                break;

            case http.Method.POST:
                if (requestData.externalid) {
                    media = InstagramAPI.getMediaById(
                        requestData.externalid,
                        requestData.hashtag
                    );
                    extend(requestData, media);
                    res = HashtagGalleryModel.create(
                        requestData
                    );
                    context.response.write(JSON.stringify({ internalid: res, status: requestData.status }));
                }
                break;
            case http.Method.PUT:
                if (requestData.internalid) {
                    media = InstagramAPI.getMediaById(
                        requestData.externalid,
                        requestData.hashtag
                    );
                    extend(requestData, media);
                    res = HashtagGalleryModel.create(
                        requestData
                    );
                    context.response.write(JSON.stringify({ internalid: res, status: requestData.status }));
                }
                break;
            default:

                break;
            }
        }
    };
});
