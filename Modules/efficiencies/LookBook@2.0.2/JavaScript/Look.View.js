define('Look.View', [
    'Backbone',
    'LookItem.View',
    'Backbone.CompositeView',
    'Backbone.CollectionView',

    'lookbook_look.tpl',
    'look_item_row.tpl',
    'look_item_cell.tpl',
    'jQuery',
    'underscore'
], function LookBookView(
    Backbone,
    LookItemView,
    CompositeView,
    CollectionView,

    lookTpl,
    lookRowTpl,
    lookCellTpl,
    jQuery,
    _
) {
    'use strict';

    return Backbone.View.extend({
        template: lookTpl,

        initialize: function initialize() {
            var self = this;
            CompositeView.add(this);
            this.on('afterViewRender', function afterViewRender() {
                _.initBxSlider(self.$('[data-slider]'), {
                    nextText: '<a class="look-gallery-next-icon"></a>',
                    prevText: '<a class="look-gallery-prev-icon"></a>'
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
                text: this.model.get('lookbook'),
                href: '/lookbook/' + this.model.get('lookbookUrlcomponent')
            },
            {
                text: this.model.get('name'),
                href: '/' + this.model.get('urlcomponent')
            }];
        },

        childViews: {
            'LookBook.LookItems': function lookItems() {
                return new CollectionView({
                    collection: this.model.get('items'),
                    childView: LookItemView,
                    viewsPerRow: 3,
                    rowTemplate: lookRowTpl,
                    cellTemplate: lookCellTpl
                });
            }
        },

        getContext: function getContext() {
            return {
                name: this.model.get('name'),
                sequence: this.model.get('sequence'),
                urlcomponent: this.model.get('urlcomponent'),
                shortdesc: this.model.get('shortdesc'),
                longdesc: this.model.get('longdesc'),
                mainimage: this.model.get('image2'),
                altimage: this.model.get('image3'),
                lookbook: this.model.get('lookbook')
            };
        }
    });
});
