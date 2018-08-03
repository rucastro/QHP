define('{{moduleName}}', [
    '{{routerFile}}'
], function {{moduleClass}}(
    {{routerClass}}
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            return new {{routerClass}}({application: application});
        }
    };
});