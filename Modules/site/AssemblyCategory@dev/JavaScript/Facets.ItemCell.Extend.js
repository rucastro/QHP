define('Facets.ItemCell.Extend', [
    'Facets.ItemCell.View',
    'SC.Configuration',
    'underscore'
], function FacetsItemCellExtend(
    FacetsItemCellView,
    Configuration,
    _
) {
    'use strict';

    _.extend(FacetsItemCellView.prototype, {

        getContext: _.wrap(FacetsItemCellView.prototype.getContext, function getContext(fn) {

            var content = fn.apply(this, _.toArray(arguments).slice(1));
            if (this.model.get('custitem_ps_assemblycategorylink')) {
                content.url = this.model.get('custitem_ps_assemblycategorylink');

                content.isEnvironmentBrowser = false;
                }

            return content;
        })
    });
});
