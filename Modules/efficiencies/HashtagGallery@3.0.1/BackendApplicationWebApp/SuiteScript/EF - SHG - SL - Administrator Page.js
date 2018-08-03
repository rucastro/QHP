/**
 * @NApiVersion 2.0
 * @NScriptName EF - SHG - SL | Administrator Page
 * @NScriptId _ef_shg_sl_administrator
 * @NModuleScope Public
 * @NScriptType Suitelet
 */
define([
    'N/file',
    'N/url',
    'N/runtime',
    'N/ui/serverWidget'
], function Suitelet(
    fileAPI,
    urlAPI,
    runtimeAPI,
    uiAPI
) {
    'use strict';

    return {
        onRequest: function onResponse(context) {
            var isLocal = context.request.parameters.local === 'T';
            var bundleId = (runtimeAPI.getCurrentScript().bundleIds
                            && runtimeAPI.getCurrentScript().bundleIds[0]) || '93280';
            var assetsPath = '/c.' + runtimeAPI.accountId + '/suitebundle' + bundleId + '/BackendWebApp/';
            var indexPath = 'SuiteBundles/Bundle ' + bundleId + '/BackendWebApp/';
            var env = {
                ASSETS_PATH: assetsPath,
                HASHTAG_SVC: urlAPI.resolveScript({
                    scriptId: 'customscript_ef_shg_sl_hashtag_svc',
                    deploymentId: 'customdeploy_ef_shg_sl_hashtag_svc'
                }),
                HASHTAG_GALLERY_SVC: urlAPI.resolveScript({
                    scriptId: 'customscript_ef_shg_sl_hashtag_gallery_s',
                    deploymentId: 'customdeploy_ef_shg_sl_hashtag_gallery_s'
                })
            };


            var file = fileAPI.load(indexPath + 'index' + (isLocal ? '-local' : '') + '.html');
            var content = file.getContents();

            var form = uiAPI.createForm({
                title: 'Hashtag Gallery',
                hideNavBar: false
            });
            var field = form.addField({
                id: 'extra',
                label: 'lalala',
                type: 'inlinehtml'
            });

            content = content.replace('/* PLACE ENV */', 'var ENVIRONMENT=' + JSON.stringify(env) + ';');
            content = content.replace(/\{\{bundlepath}}/gi, assetsPath);

            field.defaultValue = content;


            context.response.writePage(form);
        }
    };
});
