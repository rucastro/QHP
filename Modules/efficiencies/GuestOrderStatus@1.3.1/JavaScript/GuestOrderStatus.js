define('GuestOrderStatus', [
    'GuestOrderStatus.Router',
    'GuestOrderStatus.Model',
    'underscore',
    'Utils'
], function GuestOrderStatus(
    Router,
    Model,
    _
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var self = this;
            application.on('afterModulesLoaded', function afterModulesLoaded() {
                var configuration = application.getConfig('modulesConfig').GuestOrderStatus ||
                    (application.getConfig('modulesConfig').GuestOrderStatus = {});

                _.defaults(configuration, SC.ENVIRONMENT.published.GuestOrderStatus_DevConfig);

                self.setModelValidation(configuration);
            });

            return new Router(application);
        },
        setModelValidation: function setModelValidation(config) {
            _.each(config.secondField, function each(value) {
                var validations = [{
                    required: Model.prototype.validateRequired,
                    msg: _('$(0) is required').translate(value.name)
                }];
                validations.push(value.validation);

                Model.prototype.validation[value.id] = validations;
                Model.prototype.bindings['[name="' + value.id + '"]'] = value.id;
            });
        }
    };
});
