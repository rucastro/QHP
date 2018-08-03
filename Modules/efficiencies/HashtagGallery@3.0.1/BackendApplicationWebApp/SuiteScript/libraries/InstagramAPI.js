/**
 * @NApiVersion 2.0
 * @NScriptName EF - SMH | Instagram API
 * @NScriptId _instagram_api
 * @NModuleScope Public
 */
define([
    'N/https',
    'N/format',
    'N/runtime',
    'N/error',
    './../libraries/underscore-nonamed-define'
], function InstagramAPI(
    https,
    formatter,
    runtime,
    error,
    _
) {
    'use strict';


    var NETWORK_ID = 1;

    var API_BASE_URL = 'https://api.instagram.com/';
    var API_ENDPOINTS = {
        'media_recent': 'v1/tags/{{tag-name}}/media/recent',
        'media': 'v1/media/{{media-id}}',
        'tagcount': 'v1/tags/{{tag-name}}'
    };
    var PAGINATION = 32;

    var credentials = {
        key: '',
        secret: '',
        accessToken: ''
    };

    var getParamsFromObject = function getParamsFromObject(params) {
        return Object.keys(params).map(function map(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }).join('&');
    };

    var addParamsToUrl = function addParamsToUrl(baseUrl, params) {
        var paramString;
        var joinString;
        // We get the search options from the config file
        if (baseUrl && Object.keys(params).length !== 0) {
            paramString = getParamsFromObject(params);
            joinString = ~baseUrl.indexOf('?') ? '&' : '?'; // eslint-disable-line no-bitwise

            return baseUrl + joinString + paramString;
        }

        return baseUrl;
    };

    var appendCredentialsToUrl = function appendCredentialsToUrl(url) {
        return addParamsToUrl(url, {
            'client_id': credentials.key,
            'client_secret': credentials.secret,
            'access_token': credentials.accessToken
        });
    };

    var getEndpoint = function getEndpoint(endpoint, params) {
        var url = API_BASE_URL + API_ENDPOINTS[endpoint];
        switch (endpoint) {
        case 'media_recent':
            url = url.replace('{{tag-name}}', params.hashtag);
            if (params.max_tag_id) {
                url = addParamsToUrl(url, { max_tag_id: params.max_tag_id });
            }
            if (params.prev_max_tag_id) {
                url = addParamsToUrl(url, { prev_max_tag_id: params.prev_max_tag_id });
            }
            break;
        case 'media':
            url = url.replace('{{media-id}}', params.id);
            break;

        case 'tagcount':
            url = url.replace('{{tag-name}}', params.hashtag);
            break;

        default:
            throw new error.create({ name: 'ENDPOINT_SUPPORT', message: 'Endpoint not supported' });
        }

        url = addParamsToUrl(url, { count: PAGINATION });

        return appendCredentialsToUrl(url);
    };

    var mapper = function map(data) {
        return {
            network: NETWORK_ID,
            externalid: data.id,
            assetUrl: data.images && data.images.standard_resolution.url,
            lowResAssetUrl: data.images && data.images.low_resolution.url,
            thumbnailAssetUrl: data.images && data.images.thumbnail && data.images.thumbnail.url,
            createdDate: formatter.format({
                type: formatter.Type.DATETIMETZ,
                value: new Date(data.created_time * 1000),
                timezone: formatter.Timezone.GMT
            }),
            createdTimestamp: data.created_time,
            link: data.link,
            caption: data.caption && data.caption.text,
            hashtags: data.tags,
            userName: data.user && data.user.username,
            userId: data.user && data.user.id,
            userPic: data.user && data.user.profile_picture,
            userFullName: (data.user && data.user.full_name) || (data.user && data.user.username)
        };
    };


    return {
        setCredentials: function setCredentials(pCredentials) {
            _.extend(credentials, pCredentials);
        },
        getTotalCount: function getTotalCount(hashtag) {
            var response;
            var fullUrl = getEndpoint('tagcount', {
                hashtag: hashtag
            });
            var jsonData;
            log.debug('Call to api', fullUrl);
            response = https.get({
                url: fullUrl,
                headers: {
                    'Accept-Encoding': 'compress, gzip'
                }
            });
            jsonData = JSON.parse(response.body);

            log.debug('jsondata', jsonData);
            return jsonData && jsonData.data && jsonData.data.media_count;
        },
        getMediaById: function getMediaById(mediaId) {
            var response;
            var fullUrl = getEndpoint('media', {
                id: mediaId
            });
            var jsonData;
            log.debug('CALL TO API', fullUrl);
            response = https.get({
                url: fullUrl,
                headers: {
                    'Accept-Encoding': 'compress, gzip'
                }
            });

            jsonData = JSON.parse(response.body);

            return jsonData && mapper(jsonData.data);
        },

        getRecentsByHashtag: function getRecentsByHashtag(hashtag, paginationData) {
            var session = runtime.getCurrentSession();
            var pagerId;
            var response;
            var jsonData;
            var fullUrl;
            var page;
            var sessionPaginator;
            var sessionPageCount;
            var nextPage;
            var prevPage;

            if (paginationData.page) {
                page = paginationData.page;
            } else {
                page = '0';
            }
            if (paginationData && paginationData.pagerId) {
                pagerId = paginationData.pagerId;
            } else {
                pagerId = (Math.random() * 1e32).toString(36);
            }

            sessionPaginator = session.get({ name: 'pager:' + pagerId });
            sessionPageCount = session.get({ name: 'pageCount' + pagerId });
            try {
                sessionPaginator = JSON.parse(sessionPaginator);
            } catch (e) {
                sessionPaginator = {};
            }

            if (!sessionPageCount) {
                sessionPageCount = this.getTotalCount(hashtag);
            }


            if (page && sessionPaginator && sessionPaginator[page]) {
                fullUrl = sessionPaginator[page];
            } else {
                sessionPaginator = {};
                page = '0';
                pagerId = (Math.random() * 1e32).toString(36);
                fullUrl = getEndpoint('media_recent', {
                    hashtag: hashtag
                });
                sessionPaginator[page] = fullUrl;
            }

            log.debug('CALL TO API', fullUrl);
            response = https.get({
                url: fullUrl,
                headers: {
                    'Accept-Encoding': 'compress, gzip'
                }
            });


            try {
                jsonData = JSON.parse(response.body);
            } catch (e) {
                throw new error.create({ name: 'API_DOWN', message: 'Instagram API not responding' });
            }

            if (!jsonData.meta || jsonData.meta.code !== 200) {
                throw new error.create({
                    name: 'API_ERROR',
                    message: ((jsonData && jsonData.meta && jsonData.meta.error_message) || 'Unknown error')
                });
            }

            prevPage = parseInt(page, 10) - 1;
            nextPage = parseInt(page, 10) + 1;
            sessionPaginator[nextPage.toString()] = jsonData.pagination.next_url;

            session.set({ name: 'pager:' + pagerId, value: JSON.stringify(sessionPaginator) });
            session.set({ name: 'pageCount:' + pagerId, value: sessionPageCount });

            return {
                results: this.formatResponse(jsonData.data),
                count: sessionPageCount,
                linkParams: {
                    prev: {
                        page: prevPage,
                        pagerId: pagerId
                    },
                    next: {
                        page: nextPage,
                        pagerId: pagerId
                    }
                },
                hashtag: hashtag
            };
        },
        formatResponse: function formatResponse(datas) {
            return datas && datas.map(function mapDatas(m) {
                return mapper(m);
            });
        }
    };
});
