define('Case.Create.View.UrlParams', [
    'Case.Create.View',
    'underscore'
], function CaseCreateViewUrlParams(
    CaseCreateView,
    _
) {
    'use strict';

    _(CaseCreateView.prototype).extend({

        initialize: _.wrap(CaseCreateView.prototype.initialize, function wrapInitialize(fn, options) {
            var self = this;
            fn.apply(this, _.toArray(arguments).slice(1));
            this.updateModelFromOptions(options.params);
            this.on('beforeCompositeViewRender', function afterViewRender() {
                self.updateEmailInputState();
            });
        }),
        updateEmailInputState: function updateEmailInputState() {
            var emailInput = this.$('[data-case-email]');
            var includeEmail = this.model.get('include_email');

            emailInput.prop('disabled', !includeEmail);

            if (includeEmail) {
                this.$('[data-collapse-content]').collapse('show');
            }
        },
        updateModelFromOptions: function updateModelFromParams(params) {
            var includeEmail;
            var attributes = {};
            var bindingAttributeNames = _.pluck(_.values(this.bindings), 'observe');

            // add all valid params to attributes
            _(bindingAttributeNames).each(function each(key) {
                attributes[key] = null;
                if (key in params) {
                    attributes[key] = params[key];
                }
            });

            // convert include_email from T/F to boolean
            // allow these positive values: 1, true, T
            includeEmail = attributes.include_email;
            attributes.include_email = includeEmail && (
                    (includeEmail === '1') ||
                    (includeEmail === 'T') ||
                    (includeEmail === 'true')
                );
            if (!attributes.include_email) {
                delete attributes.email;
            }

            this.model.set(attributes);
        }

    });
});
