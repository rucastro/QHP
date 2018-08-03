define('Case.Router.UrlParams', [
    'Case.Router',
    'underscore'
], function CaseRouterUrlParams(
    CaseRouter,
    _
) {
    'use strict';

    _(CaseRouter.prototype.routes).extend({
        'newcase?:options': 'createNewCase'
    });

    CaseRouter.prototype.createNewCase = _.wrap(
        CaseRouter.prototype.createNewCase, function wrapCreateCase(fn, options) {
            fn.apply(this, [null, options]);
        }
    );
});
