define('LookBook.View', [
    'Backbone',
    'lookbook_lookbook.tpl',
    'underscore',
    'SC.Configuration'
], function LookBookView(
    Backbone,
    lookBookTpl,
    _,
    Configuration
) {
    'use strict';

    return Backbone.View.extend({
        template: lookBookTpl,

        initialize: function initialize() {
            var self = this;
            this.on('afterViewRender', function afterViewRender() {
                _.initBxSlider(self.$('[data-slider]'), {
                    nextText: '<a class="lookbook-gallery-next-icon"></a>',
                    prevText: '<a class="lookbook-gallery-prev-icon"></a>'
                });
            });
        },

        getMetaDescription: function getMetaDescription() {
            return this.model.get('metadesc') || this.model.get('longdesc');
        },

        getMetaKeywords: function getMetaKeywords() {
            return this.model.get('metakeys') || this.model.get('name');
        },

        getTitle: function getTitle() {
            return this.model.get('title') || this.model.get('name');
        },

        getBreadcrumbPages: function getBreadcrumbPages() {
            return [{
                text: this.model.get('name'),
                href: '/' + this.model.get('urlcomponent')
            }];
        },

        getContext: function getContext() {
            return {
                name: this.model.get('name'),
                urlcomponent: this.model.get('urlcomponent'),
                shortdesc: this.model.get('shortdesc'),
                longdesc: this.model.get('longdesc'),
                align: this.model.get('align'),
                textcolor: this.model.get('textcolor'),
                image: this.model.get('image'),
                looks: this.model.get('looks'),
                displayLookBookSlide: Configuration.get('lookBook').displayLookBookSlide
            };
        }
    });
});
