define('CustomFieldsParser', [
    'underscore'
], function CustomFieldsParser(
    _
) {
    'use strict';

    return function customFieldsParser(customEntityFieldsResponse) {
        return _.object(
            _.map(customEntityFieldsResponse, function mapResponse(field) {
                return [field.name, field.value];
            })
        );
    };
});
