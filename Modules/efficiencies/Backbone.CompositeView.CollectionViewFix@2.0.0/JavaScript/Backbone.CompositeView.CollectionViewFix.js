define('Backbone.CompositeView.CollectionViewFix', [
    'underscore',
    'Backbone.CompositeView',
    'Utils'
], function CollectionViewFix(
    _,
    BackboneCompositeView,
    Utils
) {
    'use strict';

    /**
     * FIX: enable data-phone-template and data-tablet-template to work on collection views
     */
    _(BackboneCompositeView).extend({

        /* eslint-disable */
        _setCustomTemplate: function (placeholder, child_view, template_prefix)
        {
            var template_prefix = this._getCustomTemplatePrefix();

            _.each(template_prefix, function (prefix)
            {
                var template = template || '';
                var data_template_prefix = template_prefix ? template_prefix : ''
                ,   template_name = child_view.placeholderData[data_template_prefix ? data_template_prefix + 'Template' : 'template'];

                // if (template_name)
                // {
                    var definitive_template_name = Utils.selectByViewportWidth({
                        phone: child_view.placeholderData[data_template_prefix ? data_template_prefix + 'PhoneTemplate' : 'phoneTemplate'] //remember that data-phone-template get's converted in phoneTemplate when we use jQuery.data()
                        ,   tablet: child_view.placeholderData[data_template_prefix ? data_template_prefix + 'TabletTemplate' : 'tabletTemplate']
                        ,   desktop: template_name
                    }, template_name);

                    if (definitive_template_name)
                    {
                        // IMPORTANT: we are require()ing the template dynamically! In order to this to work, the template should
                        // be ALREADY loaded and this is automatically handled at build time by gulp template
                        template = Utils.requireModules(definitive_template_name + '.tpl');
                        child_view[template_prefix ? template_prefix + 'Template' : 'template'] = template;
                    }
                    else
                    {
                        child_view[prefix ? prefix + 'Template' : 'template'] = child_view._originalTemplate;
                    }
                // }
            });

        }
        /* eslint-enable */

    });
});
