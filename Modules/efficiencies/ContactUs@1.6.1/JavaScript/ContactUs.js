define('ContactUs', [
    'ContactUs.Router',
    'Header.Profile.View',
    'LoginRegister.View',
    'SC.Configuration',
    'underscore'
], function ContactUs(
    Router,
    HeaderProfileView,
    LoginRegisterView,
    Configuration,
    _
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            var config = Configuration.get('contactUs', {});
            if (config.enabled) {
                HeaderProfileView.prototype.initialize = _.wrap(HeaderProfileView.prototype.initialize,
                    function initialize(fn) {
                        fn.apply(this, _.toArray(arguments).slice(1));
                        this.on('afterViewRender', function afterViewRender() {
                            if (config.enableAsRegistration) {
                                this.$el.find('.header-profile-register-link')
                                    .attr('data-touchpoint', '')
                                    .attr('data-hashtag', '')
                                    .attr('href', config.urlcomponent);
                            }
                        });
                    }
                );

                LoginRegisterView.prototype.initialize = _.wrap(LoginRegisterView.prototype.initialize,
                    function initialize(fn) {
                        fn.apply(this, _.toArray(arguments).slice(1));
                        if (config.enableAsRegistration) {
                            this.enableRegister = false;
                            this.showRegister = false;
                        }
                    }
                );

                return new Router(application);
            }

            return true;
        }
    };
});
