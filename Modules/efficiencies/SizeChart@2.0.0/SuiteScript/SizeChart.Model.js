define('SizeChart.Model', [
    'SC.Model'
], function SizeChartModel(
    SCModel
) {
    'use strict';

    return SCModel.extend({
        name: 'SizeChart',
        record: 'customrecord_ef_sc_size_chart',
        localeRecord: 'customrecord_ef_sc_chart_locale',
        get: function get(id, locale) {
            var fields = [
                'internalid',
                'name',
                'custrecord_ef_sc_sc_html',
                'custrecord_ef_sc_sc_urlcomponent',
                'custrecord_ef_sc_sc_pdplink'
            ];
            var multilanguageEnabled = context.getSetting('FEATURE', 'MULTILANGUAGE') === 'T';
            var localizedContent;
            var volatility = response.CACHE_DURATION_MEDIUM;
            var result = nlapiLookupField(this.record, id, fields);
            var l = session.getShopperLanguageLocale();


            if (!result) {
                throw notFoundError;
            }

            if (multilanguageEnabled) {
                if (locale) {
                    localizedContent = this.getLocale(result.internalid, locale);
                } else {
                    if (l === 'en') l = 'en_US';

                    localizedContent = this.getLocale(result.internalid, l);
                    volatility = response.CACHE_DURATION_UNIQUE;
                }
            }

            return {
                internalid: result.internalid,
                name: result.name,
                html: (localizedContent && localizedContent.html) || result.custrecord_ef_sc_sc_html,
                urlcomponent: result.custrecord_ef_sc_sc_urlcomponent,
                volatility: volatility,
                sll: session.getShopperLanguageLocale(),
                pdplink: result.custrecord_ef_sc_sc_pdplink
            };
        },

        getLocale: function getLocale(internalid, locale) {
            var columns = [
                new nlobjSearchColumn('custrecord_ef_sc_cl_html'),
                new nlobjSearchColumn('custrecord_ef_sc_cl_pdplink')
            ];
            var filters = [
                new nlobjSearchFilter('custrecord_ef_sc_cl_size_chart', null, 'is', internalid),
                new nlobjSearchFilter('custrecord_ef_sc_cl_localevalue', null, 'is', locale)
            ];
            var result = nlapiSearchRecord(this.localeRecord, null, filters, columns);

            return result && result[0] && {
                html: result[0].getValue('custrecord_ef_sc_cl_html')
            };
        }
    });
});
