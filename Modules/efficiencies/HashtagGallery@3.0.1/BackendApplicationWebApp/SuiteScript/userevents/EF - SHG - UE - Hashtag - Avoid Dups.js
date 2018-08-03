/**
 * @NApiVersion 2.0
 * @NScriptName EF - SHG - UE | Hashtag - Avoid Dups
 * @NScriptId _ef_shg_ue_hashtag_dups
 * @NModuleScope Public
 * @NScriptType UserEventScript
 */
define([
    'N/ui/serverWidget',
    'N/url',
    'N/runtime',
    'N/search',
    'N/error'
], function HashtagService(
    ui,
    urlAPI,
    runtime,
    search,
    error
) {
    'use strict';

    return {
        beforeLoad: function beforeLoad(context) {
            var record;
            var form;
            var field;
            var url;

            if (runtime.executionContext === runtime.ContextType.USER_INTERFACE) {
                record = context.newRecord;
                form = context.form;
                field = form.addField({
                    id: 'custpage_extra',
                    label: 'Moderate',
                    type: 'inlinehtml'
                });

                url = urlAPI.resolveScript({
                    scriptId: 'customscript_ef_shg_sl_administrator',
                    deploymentId: 'customdeploy_ef_shg_sl_administrator'
                }) + '#/hashtag/' + record.getValue('name') + '/';

                field.defaultValue = '<a class="uir-field inputreadonly" href="' +
                    url + '" target="fldUrlWindow">Moderate Hashtag</a>';
            }
        },
        /**
         * TODO:FIXED FOR 16,1
         * @param context
         */
        beforeSubmit: function beforeSubmit(context) {
            var results;

            if (context.type === context.UserEventType.CREATE ||
                context.type === context.UserEventType.EDIT ||
                context.type === context.UserEventType.INLINE_EDIT
            ) {
                if (context.type === context.UserEventType.CREATE ||
                    (context.newRecord.getValue('name').toLocaleLowerCase() !==
                    context.oldRecord.getValue('name').toLocaleLowerCase())
                ) {
                    results = search.create({
                        type: 'customrecord_ef_social_media_hashtag',
                        columns: [
                            'internalid',
                            'name'
                        ],
                        filters: [
                            search.createFilter({
                                name: 'name',
                                operator: search.Operator.IS,
                                values: context.newRecord.getValue('name')
                            })
                        ]
                    }).run().getRange(0, 1);

                    if (results && results.length > 0) {
                        throw new error.create({
                            name: 'DUPLICATE_HASHTAG',
                            message: 'Hashtag already in the system',
                            notifyOff: true
                        });
                    }
                }
            }
        }
    };
});
